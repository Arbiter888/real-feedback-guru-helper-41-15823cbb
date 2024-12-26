import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewText, refinedReview, receiptData, customerName } = await req.json();

    if (!reviewText) {
      throw new Error("Review text is required");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing customer reviews and suggesting personalized vouchers. 
            Consider the sentiment, spending habits, and specific details mentioned in the review.
            Generate a voucher that will encourage the customer to return while addressing any specific preferences or concerns.
            The response should be a JSON object with:
            - title: A catchy, personalized voucher title
            - description: Brief description of the offer
            - validDays: Number of days the voucher should be valid (between 7-30)
            - discountValue: Suggested discount (e.g., "15% off", "$10 off")`
          },
          {
            role: 'user',
            content: `Generate a personalized voucher suggestion for ${customerName} based on this data:
            Review: "${reviewText}"
            ${refinedReview ? `Enhanced review: "${refinedReview}"` : ''}
            ${receiptData ? `They spent $${receiptData.total_amount} and ordered: ${receiptData.items?.map(item => item.name).join(', ')}` : ''}`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from OpenAI");
    }

    const suggestion = JSON.parse(data.choices[0].message.content);
    console.log('Parsed suggestion:', suggestion);

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in suggest-voucher function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});