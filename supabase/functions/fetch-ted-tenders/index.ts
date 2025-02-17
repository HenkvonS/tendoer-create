
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Using correct base URL for TED API
const API_ENDPOINT = 'https://ted-europa.eu/api/v2.0.9/notices'
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

    // Query parameters for v2.0.9 API
    const params = new URLSearchParams({
      api_key: apiKey,
      fields: 'all',
      page_size: BATCH_SIZE.toString(),
      scope: 'active',
      order_by: '-publication_date'
    });

    console.log('Making request to TED API endpoint:', `${API_ENDPOINT}?${params.toString().replace(apiKey, '[REDACTED]')}`);
    
    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TED API error response:', errorText);
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      throw new Error(`TED API query failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('TED API response received');

    if (!data.notices || !Array.isArray(data.notices) || data.notices.length === 0) {
      console.log('No notices found in TED API response');
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

    console.log(`Found ${data.notices.length} tenders`);

    const tenders = data.notices.map((notice: any) => ({
      id: notice.id ? parseInt(notice.id) : Date.now(),
      title: notice.title || 'Untitled Notice',
      publication_date: notice.publication_date || new Date().toISOString(),
      type: 'contract_notice',
      buyer_name: notice.contracting_body?.name || 'Unknown',
      buyer_country: notice.contracting_body?.country || 'EU',
      value_amount: notice.value?.amount ? parseFloat(notice.value.amount) : null,
      value_currency: notice.value?.currency || null,
      original_url: notice.uri || null,
      description: notice.description || null,
      cpv_codes: notice.cpv_codes || [],
      reference_number: notice.reference || notice.id?.toString(),
      sync_status: 'synced',
      last_sync_attempt: new Date().toISOString()
    }));

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
