
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SPARQL_ENDPOINT = 'https://publications.europa.eu/webapi/rdf/sparql'
const BATCH_SIZE = 100

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

    // Query recent tender notices using the Publications Office ontology
    const sparqlQuery = `
      PREFIX epo: <http://data.europa.eu/a4g/ontology#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      
      SELECT DISTINCT ?notice ?title ?date ?buyer ?country ?value ?currency
      WHERE {
        ?notice a epo:Contract ;
                dc:title ?title ;
                epo:publicationDate ?date ;
                epo:buyer ?buyerNode .
        
        ?buyerNode epo:name ?buyer ;
                   epo:country ?countryNode .
        ?countryNode epo:code ?country .
        
        OPTIONAL {
          ?notice epo:estimatedValue ?valueNode .
          ?valueNode epo:amount ?value ;
                    epo:currency ?currency .
        }
        
        FILTER(?date >= "2024-01-01"^^xsd:date)
      }
      ORDER BY DESC(?date)
      LIMIT ${BATCH_SIZE}
    `

    console.log('Querying SPARQL endpoint:', SPARQL_ENDPOINT);
    
    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`
    })

    if (!response.ok) {
      console.error('SPARQL response status:', response.status);
      console.error('SPARQL response text:', await response.text());
      throw new Error(`SPARQL query failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('SPARQL response:', JSON.stringify(data, null, 2));

    // Extract notice ID from the URI
    const extractNoticeId = (uri: string) => {
      const parts = uri.split('/');
      const lastPart = parts[parts.length - 1];
      // Remove any non-numeric characters and convert to number
      const id = parseInt(lastPart.replace(/\D/g, ''));
      return id;
    };

    const tenders = data.results.bindings.map((binding: any) => ({
      id: extractNoticeId(binding.notice.value),
      title: binding.title.value,
      publication_date: binding.date.value,
      type: 'contract_notice',
      buyer_name: binding.buyer.value,
      buyer_country: binding.country.value,
      value_amount: binding.value?.value ? parseFloat(binding.value.value) : null,
      value_currency: binding.currency?.value,
      original_url: binding.notice.value,
      sync_status: 'synced',
      last_sync_attempt: new Date().toISOString()
    }))

    console.log(`Processing ${tenders.length} tenders:`, tenders);

    // Insert or update tenders in the database
    const { error } = await supabaseClient
      .from('ted_tenders')
      .upsert(tenders, { 
        onConflict: 'id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Synced ${tenders.length} tenders`
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
