
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_ENDPOINT = 'https://ted.europa.eu/api/v3.0/notices/search-notices'  // Updated endpoint
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

    // Query parameters for the TED API
    const queryBody = {
      apiKey,
      fields: ["CONTENT"],  // Updated to match curl example
      q: "PC=[320*]",
      pageSize: BATCH_SIZE,
      sortField: "publicationDate",
      sortOrder: "desc"
    };

    console.log('Making request to TED API endpoint:', API_ENDPOINT);
    console.log('Query parameters:', { ...queryBody, apiKey: '[REDACTED]' });
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(queryBody)
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

    console.log(`Found ${data.results.length} tenders`);

    const tenders = data.results.map((notice: any) => ({
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
