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
            Generate a voucher that will encourage the customer to return.
            
            The offer title should be clear and specific, like:
            - "15% Off Your Next Visit"
            - "Free Dessert with Main Course"
            - "Buy One Get One Free on Main Courses"
            
            The description should include clear terms and conditions, for example:
            - "Valid Monday to Thursday, excluding public holidays"
            - "Maximum discount value of $30"
            - "One voucher per table"
            - "Must be used within 30 days"
            - "Not valid with other promotions"
            
            Consider the sentiment, spending habits, and specific details mentioned in the review.`
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