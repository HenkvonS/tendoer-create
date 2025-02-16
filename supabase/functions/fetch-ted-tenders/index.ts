
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SPARQL_ENDPOINT = 'https://data.europa.eu/api/hub/sparql'
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

    // Query recent tender notices
    const sparqlQuery = `
      PREFIX ted: <http://data.europa.eu/ted#>
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      SELECT DISTINCT ?notice ?title ?date ?buyer ?country ?value ?currency
      WHERE {
        ?notice a ted:Notice ;
                dc:title ?title ;
                ted:publicationDate ?date ;
                ted:buyer ?buyerNode .
        ?buyerNode ted:name ?buyer ;
                   ted:countryCode ?country .
        OPTIONAL {
          ?notice ted:estimatedValue ?valueNode .
          ?valueNode ted:amount ?value ;
                     ted:currency ?currency .
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

    const tenders = data.results.bindings.map((binding: any) => ({
      id: parseInt(binding.notice.value.split('/').pop()),
      title: binding.title.value,
      publication_date: binding.date.value,
      type: 'contract_notice',
      buyer_name: binding.buyer.value,
      buyer_country: binding.country.value,
      value_amount: binding.value?.value,
      value_currency: binding.currency?.value,
      original_url: binding.notice.value,
      sync_status: 'synced',
      last_sync_attempt: new Date().toISOString()
    }))

    console.log(`Processing ${tenders.length} tenders`);

    // Insert or update tenders in the database
    const { error } = await supabaseClient
      .from('ted_tenders')
      .upsert(tenders, { onConflict: 'id' })

    if (error) throw error

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
