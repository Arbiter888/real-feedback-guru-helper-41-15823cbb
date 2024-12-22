import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { review, receiptData, restaurantName, serverName } = await req.json();
    console.log('Processing review:', review, 'with receipt data:', receiptData, 'for restaurant:', restaurantName, 'server:', serverName);

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const systemPrompt = receiptData 
      ? `You are EatUP!, an AI assistant that helps refine restaurant reviews for ${restaurantName}. Your task is to create an engaging and detailed review that incorporates the customer's personal experience, specific items from their receipt, and their server's service.

Instructions:
1. Write the review directly without any "Title:" or "Review:" prefixes
2. If a server name is provided, START the review by mentioning their excellent service
3. Analyze the initial review, receipt details, and server information
4. Create a natural-sounding review that mentions specific dishes and their qualities
5. Maintain a positive, authentic tone while being detailed and helpful
6. Include the total amount spent if available
7. Keep the personal touches from the original review
8. Format dish names in proper English (e.g., "Chicken Pot Pie" not "CHICKN POT PIE")
9. Always mention the restaurant name (${restaurantName}) in the review
10. Ensure the review flows naturally and doesn't sound automated
${serverName ? `11. The review MUST begin with a positive mention of ${serverName}'s service` : ''}`
      : `You are EatUP!, an AI assistant that helps refine restaurant reviews for ${restaurantName}. Your task is to create a simple, genuine-sounding review based on the customer's feedback.

Instructions:
1. Write the review directly without any "Title:" or "Review:" prefixes
2. If a server name is provided, START the review by mentioning their excellent service
3. Keep the review concise and authentic
4. Focus on the overall experience and atmosphere
5. Maintain a positive tone while being genuine
6. Don't make up specific details about food or prices
7. Keep the personal touches from the original review
8. Always mention the restaurant name (${restaurantName}) in the review
9. Ensure the review sounds natural and not overly elaborate
${serverName ? `10. The review MUST begin with a positive mention of ${serverName}'s service` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Initial Review: "${review}"\n\nReceipt Details: ${receiptData ? JSON.stringify(receiptData) : 'No receipt data available'}${serverName ? `\n\nServer Name: ${serverName}` : ''}`
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