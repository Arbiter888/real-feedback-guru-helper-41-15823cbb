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
    console.log('Received request with:', { reviewText, refinedReview, receiptData, customerName });

    if (!reviewText?.trim()) {
      throw new Error("Review text is required");
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing customer reviews and suggesting personalized vouchers. 
            Generate a voucher that will encourage the customer to return.
            
            The response should be in JSON format with the following structure:
            {
              "title": "Clear offer description (e.g., '15% Off Next Visit', 'Free Dessert with Main Course')",
              "description": "Detailed terms and conditions",
              "validDays": number between 7-30,
              "discountValue": "Specific value (e.g., '15%', '$20 off')"
            }
            
            Terms and conditions should include:
            - Valid days/times (e.g., "Valid Monday to Thursday")
            - Any exclusions (e.g., "Excluding public holidays")
            - Usage limits (e.g., "One voucher per table")
            - Validity period mention
            - Any minimum spend requirements
            - Not valid with other promotions`
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const suggestion = JSON.parse(data.choices[0].message.content);
    console.log('Parsed suggestion:', suggestion);

    // Validate the suggestion structure
    if (!suggestion.title || !suggestion.description || !suggestion.validDays || !suggestion.discountValue) {
      throw new Error('Invalid suggestion format from OpenAI');
    }

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in suggest-voucher function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});