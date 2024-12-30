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
    const { menuUrl } = await req.json();
    
    if (!menuUrl) {
      throw new Error('Menu URL is required');
    }

    console.log('Analyzing menu from URL:', menuUrl);

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
            content: `You are a menu analysis expert. Analyze restaurant menus and extract structured data including:
              - Menu items with names and prices
              - Categories/sections
              - Special items or promotions
              - Dietary information where available
              Return the data as a clean JSON array grouped by categories.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this menu image and extract all menu items with their prices. Group items by their categories. Include any dietary information or special notes.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: menuUrl
                }
              },
            ],
          },
        ],
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    let menuAnalysis;
    try {
      menuAnalysis = JSON.parse(data.choices[0].message.content.trim());
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.log('Raw content:', data.choices[0].message.content);
      
      const jsonMatch = data.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        menuAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from OpenAI response');
      }
    }

    return new Response(
      JSON.stringify({ menuAnalysis }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in analyze-menu function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
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