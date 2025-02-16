
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SPARQL_ENDPOINT = 'https://ted.europa.eu/api/sparql'
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
      PREFIX ted: <http://ted.europa.eu/ted#>
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
      }
      ORDER BY DESC(?date)
      LIMIT ${BATCH_SIZE}
    `

    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`
    })

    if (!response.ok) {
      throw new Error(`SPARQL query failed: ${response.statusText}`)
    }

    const data = await response.json()
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
