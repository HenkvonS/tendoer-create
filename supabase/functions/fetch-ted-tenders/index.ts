
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// TED SPARQL API endpoint
const API_ENDPOINT = 'https://ted.europa.eu/api/v3/sparql'
const BATCH_SIZE = 10

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // SPARQL query to get the latest tenders
    const sparqlQuery = `
      PREFIX ted: <http://ted.europa.eu/uri/ted#>
      PREFIX dt: <http://ted.europa.eu/uri/dt#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      
      SELECT DISTINCT ?id ?title ?publicationDate ?buyer ?country ?value ?currency ?description
      WHERE {
        ?notice a ted:Notice ;
                dc:identifier ?id ;
                dc:title ?title ;
                ted:publicationDate ?publicationDate ;
                ted:buyerLegalName ?buyer .
        OPTIONAL { ?notice ted:countryCode ?country }
        OPTIONAL { ?notice ted:estimatedValue ?value }
        OPTIONAL { ?notice ted:currency ?currency }
        OPTIONAL { ?notice dc:description ?description }
      }
      ORDER BY DESC(?publicationDate)
      LIMIT ${BATCH_SIZE}
    `;

    console.log('Making request to TED SPARQL endpoint:', API_ENDPOINT);
    console.log('SPARQL Query:', sparqlQuery);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/json'
      },
      body: sparqlQuery
    })

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TED API error response:', errorText);
      throw new Error(`TED API query failed: ${response.statusText}. Response: ${errorText}`)
    }

    const data = await response.json()
    console.log('TED API response data:', JSON.stringify(data, null, 2));

    if (!data.results || !Array.isArray(data.results.bindings) || data.results.bindings.length === 0) {
      console.log('No results found in TED API response');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No tenders found in TED API response'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      })
    }

    const tenders = data.results.bindings.map((binding: any) => {
      // Extract the ID from the URI
      const idMatch = binding.id?.value.match(/\d+$/) || [Date.now().toString()];
      const id = parseInt(idMatch[0]);
      
      return {
        id,
        title: binding.title?.value || 'Untitled Notice',
        publication_date: binding.publicationDate?.value || new Date().toISOString(),
        type: 'contract_notice',
        buyer_name: binding.buyer?.value || 'Unknown',
        buyer_country: binding.country?.value || 'EU',
        value_amount: binding.value?.value ? parseFloat(binding.value.value) : null,
        value_currency: binding.currency?.value || null,
        original_url: `https://ted.europa.eu/udl?uri=TED:NOTICE:${id}:TEXT:EN:HTML`,
        description: binding.description?.value || null,
        cpv_codes: [],
        reference_number: id.toString(),
        sync_status: 'synced',
        last_sync_attempt: new Date().toISOString()
      }
    });

    console.log(`Processing ${tenders.length} tenders:`, JSON.stringify(tenders, null, 2));

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
