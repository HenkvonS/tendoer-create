
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SPARQL_ENDPOINT = 'https://publications.europa.eu/webapi/rdf/sparql'
const BATCH_SIZE = 10 // Reduced for testing

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Simplified query for testing
    const sparqlQuery = `
      PREFIX epo: <http://data.europa.eu/a4g/ontology#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      
      SELECT ?notice ?title
      WHERE {
        ?notice a epo:Contract ;
                dc:title ?title .
      }
      LIMIT ${BATCH_SIZE}
    `

    console.log('Making request to SPARQL endpoint:', SPARQL_ENDPOINT);
    console.log('Query:', sparqlQuery);
    
    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`
    })

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('SPARQL error response:', errorText);
      throw new Error(`SPARQL query failed: ${response.statusText}. Response: ${errorText}`)
    }

    const data = await response.json()
    console.log('SPARQL response data:', JSON.stringify(data, null, 2));

    if (!data.results || !data.results.bindings || data.results.bindings.length === 0) {
      console.log('No results found in SPARQL response');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No tenders found in SPARQL response'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      })
    }

    const tenders = data.results.bindings.map((binding: any) => ({
      id: parseInt(binding.notice.value.split('/').pop().replace(/\D/g, '')),
      title: binding.title.value,
      publication_date: new Date().toISOString(), // Temporary for testing
      type: 'contract_notice',
      buyer_name: 'Test Buyer', // Temporary for testing
      buyer_country: 'EU', // Temporary for testing
      value_amount: null,
      value_currency: null,
      original_url: binding.notice.value,
      sync_status: 'synced',
      last_sync_attempt: new Date().toISOString()
    }))

    console.log(`Processing ${tenders.length} test tenders:`, JSON.stringify(tenders, null, 2));

    // Insert or update tenders in the database
    const { error } = await supabaseClient
      .from('ted_tenders')
      .upsert(tenders, { 
        onConflict: 'id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Synced ${tenders.length} test tenders`
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      }
    })

  } catch (error) {
    console.error('Error in fetch-ted-tenders:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      }
    })
  }
})
