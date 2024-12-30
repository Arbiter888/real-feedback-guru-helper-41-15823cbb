import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewText, refinedReview, receiptData, customerName } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the latest active menu version
    const { data: menuVersion } = await supabase
      .from('restaurant_menu_versions')
      .select('analysis')
      .eq('is_active', true)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    console.log('Current menu version:', menuVersion);

    const prompt = `
      Based on the following information, suggest a personalized voucher for the customer:

      Customer Review: ${reviewText}
      Refined Review: ${refinedReview || 'Not available'}
      Receipt Data: ${JSON.stringify(receiptData || {})}
      Customer Name: ${customerName}
      
      ${menuVersion?.analysis ? `Current Menu Items: ${JSON.stringify(menuVersion.analysis)}` : ''}

      Generate a voucher that:
      1. References specific menu items or categories they might enjoy
      2. Considers their spending patterns from the receipt
      3. Creates an incentive for a return visit
      4. Has a clear value proposition

      Return a JSON object with:
      - title: catchy voucher title
      - description: detailed description
      - validDays: number of days voucher is valid
      - discountValue: specific discount amount or percentage
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a marketing expert specializing in restaurant loyalty programs.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate voucher suggestion');
    }

    const data = await response.json();
    const suggestion = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify(suggestion),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in suggest-voucher function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});