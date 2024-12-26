import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a marketing expert specializing in restaurant promotions and vouchers. 
            Analyze customer data to generate personalized voucher suggestions that will encourage return visits.
            Consider their spending habits, food preferences, and review sentiment.`
          },
          {
            role: 'user',
            content: `Generate a personalized voucher suggestion for ${customerName}.
            Their review: "${reviewText}"
            ${refinedReview ? `Enhanced review: "${refinedReview}"` : ''}
            ${receiptData ? `They spent $${receiptData.total_amount} and ordered: ${receiptData.items.map((item: any) => item.name).join(', ')}.` : ''}
            
            Return a JSON object with:
            - title: catchy voucher title
            - description: brief description of the offer
            - validDays: number of days the voucher should be valid (between 7-30)
            - discountValue: suggested discount (e.g., "15% off", "$10 off")`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const suggestion = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in suggest-voucher function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});