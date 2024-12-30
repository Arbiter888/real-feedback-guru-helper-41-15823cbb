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

    const systemPrompt = `You are EatUP!, an AI assistant that helps refine restaurant reviews for ${restaurantName}. 
    Your task is to create an engaging and detailed review that incorporates:
    1. The customer's personal experience
    2. Specific menu items they ordered with accurate prices
    3. Menu recommendations based on their preferences
    4. Their server's service quality
    
    Instructions:
    - Start with server mention if provided
    - Reference specific dishes from the menu
    - Include prices accurately
    - Suggest complementary dishes
    - Keep the personal touches
    - Maintain authenticity
    - Use proper dish names from the menu
    ${serverName ? `- Begin with ${serverName}'s service` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Review: "${review}"
          Receipt: ${JSON.stringify(receiptData)}
          Server: ${serverName || 'Not provided'}
          Menu Data: ${JSON.stringify(menuData)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }

    const refinedReview = response.choices[0].message.content.trim();
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
