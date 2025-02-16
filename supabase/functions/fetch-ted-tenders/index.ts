
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_ENDPOINT = 'https://ted.europa.eu/udl'
const BATCH_SIZE = 50

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

    // Using TED's REST API format
    const queryParams = new URLSearchParams({
      pageSize: BATCH_SIZE.toString(),
      pageNum: '1',
      scope: 'all', // Get all types of notices
      fields: 'all', // Get all available fields
      sortField: 'publicationDate',
      sortType: 'desc',
      format: 'json'
    });

    console.log('Making request to TED API endpoint:', `${API_ENDPOINT}?${queryParams}`);
    
    const response = await fetch(`${API_ENDPOINT}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TED API error response:', errorText);
      throw new Error(`TED API query failed: ${response.statusText}. Response: ${errorText}`)
    }

    const data = await response.json()
    console.log('TED API response data:', JSON.stringify(data, null, 2));

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
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

    const tenders = data.results.map((tender: any) => ({
      id: parseInt(tender.id || tender.referenceNumber || Date.now().toString()),
      title: tender.title,
      publication_date: tender.publicationDate,
      type: 'contract_notice',
      buyer_name: tender.buyer?.name || 'Unknown',
      buyer_country: tender.buyer?.country || 'EU',
      value_amount: tender.value?.amount ? parseFloat(tender.value.amount) : null,
      value_currency: tender.value?.currency || null,
      original_url: tender.documentUrl || null,
      sync_status: 'synced',
      last_sync_attempt: new Date().toISOString()
    }))

    console.log(`Processing ${tenders.length} tenders:`, JSON.stringify(tenders, null, 2));

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
