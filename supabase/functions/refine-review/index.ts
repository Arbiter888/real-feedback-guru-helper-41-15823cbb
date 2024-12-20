import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { review, receiptData, restaurantName } = await req.json();
    console.log('Processing review:', review, 'with receipt data:', receiptData, 'for restaurant:', restaurantName);

    const openai = new OpenAI({
      // @ts-ignore
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const systemPrompt = receiptData 
      ? `You are EatUP!, an AI assistant that helps refine restaurant reviews for ${restaurantName}. Your task is to create an engaging and detailed review that incorporates both the customer's personal experience and the specific items from their receipt.

Instructions:
1. Analyze both the initial review and the receipt details
2. Create a natural-sounding review that mentions specific dishes and their qualities
3. Maintain a positive, authentic tone while being detailed and helpful
4. Include the total amount spent if available
5. Keep the personal touches from the original review
6. Format dish names in proper English (e.g., "Chicken Pot Pie" not "CHICKN POT PIE")
7. Always mention the restaurant name (${restaurantName}) in the review
8. Ensure the review flows naturally and doesn't sound automated`
      : `You are EatUP!, an AI assistant that helps refine restaurant reviews for ${restaurantName}. Your task is to create a simple, genuine-sounding review based on the customer's feedback.

Instructions:
1. Keep the review concise and authentic
2. Focus on the overall experience and atmosphere
3. Maintain a positive tone while being genuine
4. Don't make up specific details about food or prices
5. Keep the personal touches from the original review
6. Always mention the restaurant name (${restaurantName}) in the review
7. Ensure the review sounds natural and not overly elaborate`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Initial Review: "${review}"\n\nReceipt Details: ${receiptData ? JSON.stringify(receiptData) : 'No receipt data available'}`
        }
      ],
      temperature: receiptData ? 0.7 : 0.5,
      max_tokens: receiptData ? 2048 : 1024,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.3
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    const refinedReview = response.choices[0].message.content.trim();
    console.log('Refined review:', refinedReview);

    return new Response(
      JSON.stringify({ refinedReview }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in refine-review function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        refinedReview: "We apologize, but we couldn't refine your review at this moment. Your original review has been preserved. Please try again later."
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});