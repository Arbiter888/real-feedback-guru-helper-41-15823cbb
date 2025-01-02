import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { reviewText, refinedReview, receiptData, customerName, restaurantInfo, emailContent } = await req.json();

    console.log('Received data:', { 
      reviewText, 
      refinedReview, 
      receiptData, 
      customerName,
      restaurantInfo,
      emailContent 
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get menu data
    const { data: menuVersion } = await supabase
      .from('restaurant_menu_versions')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    const menuData = menuVersion?.analysis;

    // Calculate average prices per category if menu data exists
    const categoryAverages = menuData?.sections?.reduce((acc: Record<string, number>, section: any) => {
      if (section.items && section.items.length > 0) {
        const prices = section.items.map((item: any) => item.price).filter(Boolean);
        if (prices.length > 0) {
          acc[section.name] = prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length;
        }
      }
      return acc;
    }, {}) || {};

    // Enhanced context-aware prompt
    const prompt = `
      As a restaurant marketing expert, create a personalized voucher based on this detailed context:

      Restaurant Information:
      ${JSON.stringify(restaurantInfo || {}, null, 2)}

      Customer Context:
      - Name: ${customerName || 'Customer'}
      - Review: ${reviewText || 'Not provided'}
      - Refined Review: ${refinedReview || 'Not provided'}
      - Receipt Data: ${JSON.stringify(receiptData || {})}

      Menu Information:
      ${JSON.stringify(menuData || {})}
      Category Averages: ${JSON.stringify(categoryAverages)}

      Email Campaign Context:
      ${emailContent ? `Campaign Content: ${emailContent}` : 'No campaign context provided'}

      Create a voucher that:
      1. Aligns perfectly with the restaurant's cuisine type and brand
      2. References specific menu items or categories they might enjoy
      3. Considers their spending patterns from receipt data
      4. Creates an incentive for trying signature dishes
      5. Has a clear value proposition based on menu prices
      6. Uses language and terms specific to the cuisine type
      7. Encourages exploration of different menu sections
      8. Maintains cultural authenticity in the offer

      Return a JSON object with:
      {
        "title": "catchy, cuisine-appropriate voucher title",
        "description": "detailed description mentioning specific dishes or categories",
        "validDays": number of days valid (integer),
        "discountValue": "specific discount amount or percentage"
      }

      Ensure the title and description reflect the restaurant's actual cuisine and style.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a marketing expert specializing in restaurant loyalty programs with deep knowledge of various cuisines. Always respond with valid JSON only.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate voucher suggestion');
    }

    const data = await response.json();
    const suggestionText = data.choices[0].message.content;
    
    // Parse the suggestion, ensuring it's valid JSON
    let suggestion;
    try {
      // Remove any markdown formatting if present
      const cleanJson = suggestionText.replace(/```json\n?|\n?```/g, '').trim();
      suggestion = JSON.parse(cleanJson);

      // Log the final suggestion for debugging
      console.log('Generated suggestion:', suggestion);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response:', suggestionText);
      throw new Error('Invalid response format from OpenAI');
    }

    return new Response(
      JSON.stringify(suggestion),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in suggest-voucher function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});