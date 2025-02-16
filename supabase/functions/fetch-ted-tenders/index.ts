
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// TED API documentation: https://ted.europa.eu/data/api/docs
const API_ENDPOINT = 'https://ted.europa.eu/data/api/latest-notices'
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

    // Query parameters based on TED API format
    const queryParams = new URLSearchParams({
      maxRecords: BATCH_SIZE.toString(),
      offset: '0',
      fields: 'all',
      sortField: 'publicationDate',
      sortOrder: 'desc'
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

    if (!data.records || !Array.isArray(data.records) || data.records.length === 0) {
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

    const tenders = data.records.map((record: any) => ({
      id: parseInt(record.id || record.noticeNumber || Date.now().toString()),
      title: record.title || 'Untitled Notice',
      publication_date: record.publicationDate,
      type: record.noticeType || 'contract_notice',
      buyer_name: record.contractingBody?.officialName || 'Unknown',
      buyer_country: record.contractingBody?.country || 'EU',
      value_amount: record.mainObject?.estimatedValue ? parseFloat(record.mainObject.estimatedValue) : null,
      value_currency: record.mainObject?.currency || null,
      original_url: `https://ted.europa.eu/notice/${record.id}` || null,
      description: record.description || null,
      cpv_codes: record.cpvCodes || [],
      reference_number: record.referenceNumber || null,
      sync_status: 'synced',
      last_sync_attempt: new Date().toISOString()
    }))

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
