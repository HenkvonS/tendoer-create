
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_ENDPOINT = 'https://ted-europa.eu/api/v3/sparql'
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

    const apiKey = Deno.env.get('TED_API_KEY')
    if (!apiKey) {
      throw new Error('TED API key not configured')
    }

    // SPARQL query to get recent tenders
    const sparqlQuery = `
      PREFIX ted: <http://ted.europa.eu/udl#>
      SELECT ?notice ?title ?publicationDate ?buyerName ?country ?value ?currency
      WHERE {
        ?notice a ted:Notice ;
                ted:publicationDate ?publicationDate ;
                ted:title ?title .
        OPTIONAL { ?notice ted:buyerName ?buyerName }
        OPTIONAL { ?notice ted:country ?country }
        OPTIONAL { 
          ?notice ted:estimatedValue ?valueNode .
          ?valueNode ted:amount ?value ;
                    ted:currency ?currency .
        }
      }
      ORDER BY DESC(?publicationDate)
      LIMIT ${BATCH_SIZE}
    `;

    console.log('Making request to TED API endpoint:', API_ENDPOINT);
    console.log('SPARQL Query:', sparqlQuery);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: new URLSearchParams({
        query: sparqlQuery
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TED API error response:', errorText);
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      throw new Error(`TED API query failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json();
    console.log('TED API response received:', data);

    if (!data.results?.bindings || data.results.bindings.length === 0) {
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
      const noticeUri = binding.notice.value;
      const noticeId = noticeUri.split('/').pop();
      
      return {
        id: parseInt(noticeId) || Date.now(),
        title: binding.title?.value || 'Untitled Notice',
        publication_date: binding.publicationDate?.value || new Date().toISOString(),
        type: 'contract_notice',
        buyer_name: binding.buyerName?.value || 'Unknown',
        buyer_country: binding.country?.value || 'EU',
        value_amount: binding.value?.value ? parseFloat(binding.value.value) : null,
        value_currency: binding.currency?.value || null,
        original_url: noticeUri,
        description: null,
        cpv_codes: [],
        reference_number: noticeId,
        sync_status: 'synced',
        last_sync_attempt: new Date().toISOString()
      };
    });

    console.log(`Processing ${tenders.length} tenders...`);

    const { error: upsertError } = await supabaseClient
      .from('ted_tenders')
      .upsert(tenders, { 
        onConflict: 'id',
        ignoreDuplicates: false
      })

    if (upsertError) {
      console.error('Supabase insert error:', upsertError);
      throw upsertError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully synced ${tenders.length} tenders`
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
