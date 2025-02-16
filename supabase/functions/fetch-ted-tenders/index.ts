
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_ENDPOINT = 'https://ted.europa.eu/api/v3.0/notices/search'
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

    // Using TED's v3.0 API format
    const queryParams = new URLSearchParams({
      size: BATCH_SIZE.toString(),
      page: '0',
      sort: 'publicationDate,desc'
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

    if (!data.notices || !Array.isArray(data.notices) || data.notices.length === 0) {
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

    const tenders = data.notices.map((notice: any) => ({
      id: parseInt(notice.id || notice.referenceNumber || Date.now().toString()),
      title: notice.title || 'Untitled Notice',
      publication_date: notice.publicationDate,
      type: notice.type || 'contract_notice',
      buyer_name: notice.buyerName || 'Unknown',
      buyer_country: notice.countryOfBuyer || 'EU',
      value_amount: notice.estimatedValue ? parseFloat(notice.estimatedValue) : null,
      value_currency: notice.currencyOfValue || null,
      original_url: notice.uri || null,
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
