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

    const systemPrompt = `You are a skilled restaurant reviewer who writes engaging, conversational reviews that feel personal and authentic. Your task is to enhance the customer's review while:

- Maintaining their original sentiment and key points
- Converting receipt items into natural dish names (e.g., "TRKY BRGR" becomes "Turkey Burger")
- Weaving menu items and experiences naturally into the narrative
- Only mentioning prices when relevant to the story
- Including the total amount spent near the end of the review, if provided
- Adding personal touches about service and atmosphere
- Never starting with "Review:" or any other header

Remember to:
- Keep the server's name and specific positive interactions
- Describe food in an engaging, sensory way
- Maintain a warm, conversational tone throughout
- Connect dishes to the overall dining experience
${serverName ? `- Include positive mentions of ${serverName}'s service` : ''}
${restaurantName ? `- Reference the restaurant as "${restaurantName}"` : ''}`;

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
      temperature: 0.7,
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