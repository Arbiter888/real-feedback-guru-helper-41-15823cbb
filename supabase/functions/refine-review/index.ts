import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch menu data
    const { data: menuVersion } = await supabase
      .from('restaurant_menu_versions')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    const menuData = menuVersion?.analysis;

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Base system prompt that focuses on enhancing without inventing details
    let systemPrompt = `You are a skilled restaurant reviewer who enhances customer reviews while maintaining strict accuracy. Your task is to:

1. Maintain the original sentiment and key points exactly as stated
2. Improve the structure and flow of the review
3. Never add or invent details that weren't mentioned in the original review
4. Only mention specific dishes, prices, or menu items if they were explicitly mentioned in the original review or provided in receipt data
5. Keep the tone authentic and personal
${serverName ? `6. Include positive mentions of ${serverName}'s service if mentioned in the original review` : ''}
${restaurantName ? `7. Reference the restaurant as "${restaurantName}"` : ''}

Important: Do not make assumptions or add details about:
- Specific dishes unless mentioned
- Prices unless provided
- Atmosphere unless specifically described
- Service details beyond what was mentioned
- Any sensory details (taste, smell, presentation) unless explicitly stated`;

    // Add receipt-specific instructions only if receipt data is provided
    if (receiptData) {
      systemPrompt += `\n\nReceipt data is provided, so you may:
1. Convert receipt items into natural dish names
2. Include the total amount spent near the end of the review
3. Reference specific items from the receipt`;
    }

    console.log('Using system prompt:', systemPrompt);
    console.log('Original review:', review);
    console.log('Receipt data:', receiptData);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Original review: "${review}"
          Receipt data: ${JSON.stringify(receiptData)}
          Menu data: ${JSON.stringify(menuData)}`
        }
      ],
      temperature: 0.2, // Lower temperature for more consistent, conservative output
      max_tokens: 2048,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    const refinedReview = response.choices[0].message.content.trim();
    console.log('Generated refined review:', refinedReview);

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