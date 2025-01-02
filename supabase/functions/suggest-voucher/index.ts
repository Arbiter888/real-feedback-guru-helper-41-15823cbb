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

    // Standard restaurant reward types
    const standardRewards = [
      {
        type: "percentage_discount",
        values: ["10%", "15%", "20%", "25%"],
        descriptions: ["off your entire bill", "off your next visit", "off your next meal"]
      },
      {
        type: "free_item",
        items: ["appetizer", "dessert", "drink"],
        conditions: ["with any main course", "with purchase over £20", "when dining with a friend"]
      }
    ];

    const prompt = `
      As a restaurant marketing expert, create a standard reward voucher based on this context:

      Restaurant Information:
      ${JSON.stringify(restaurantInfo || {}, null, 2)}

      Customer Context:
      - Name: ${customerName || 'Customer'}
      - Review: ${reviewText || 'Not provided'}
      - Receipt Data: ${JSON.stringify(receiptData || {})}

      Email Campaign Context:
      ${emailContent ? `Campaign Content: ${emailContent}` : 'No campaign context provided'}

      Create a voucher using ONLY these standard types of rewards:
      1. Percentage discounts (10%, 15%, 20%, or 25% off)
      2. Free appetizer with main course
      3. Free dessert with main course
      4. Free drink with meal
      5. Buy one get one free offers

      The voucher should:
      1. Use standard restaurant reward formats
      2. Be easy to understand and redeem
      3. Have clear terms and conditions
      4. Be applicable to any restaurant type
      5. Focus on common menu categories (appetizers, mains, desserts, drinks)

      Return a JSON object with:
      {
        "title": "clear, standard reward title",
        "description": "simple description with clear terms",
        "validDays": number of days valid (integer),
        "discountValue": "standard discount (%, free item, or BOGO)"
      }

      Ensure the offer is restaurant-agnostic and uses standard reward formats only.
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
            content: 'You are a marketing expert specializing in standard restaurant rewards and loyalty programs. Always respond with valid JSON only using common reward types.' 
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