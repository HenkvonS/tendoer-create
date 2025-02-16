
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Using TED's newer API version
const API_ENDPOINT = 'https://ted.europa.eu/api/v3.0/notices/search-notices'
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

    // Query parameters for the TED API
    const queryBody = {
      scope: "active",
      pageSize: BATCH_SIZE,
      sortField: "publicationDate",
      sortOrder: "desc",
      fields: ["all"]
    };

    console.log('Making request to TED API endpoint:', API_ENDPOINT);
    console.log('Query body:', JSON.stringify(queryBody, null, 2));
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(queryBody)
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
      id: parseInt(notice.id || notice.noticeNumber || Date.now().toString()),
      title: notice.title || 'Untitled Notice',
      publication_date: notice.publicationDate || new Date().toISOString(),
      type: 'contract_notice',
      buyer_name: notice.buyerInformation?.officialName || 'Unknown',
      buyer_country: notice.buyerInformation?.country || 'EU',
      value_amount: notice.values?.estimatedValue ? parseFloat(notice.values.estimatedValue) : null,
      value_currency: notice.values?.currency || null,
      original_url: notice.tedUrl || `https://ted.europa.eu/udl?uri=TED:NOTICE:${notice.id}:TEXT:EN:HTML`,
      description: notice.shortDescription || null,
      cpv_codes: notice.cpvCodes || [],
      reference_number: notice.referenceNumber || notice.id?.toString(),
      sync_status: 'synced',
      last_sync_attempt: new Date().toISOString()
    }));

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
