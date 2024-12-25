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
    const { sentiment } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a restaurant marketing expert that suggests personalized vouchers based on customer sentiment. Generate 3 voucher suggestions that would be appropriate for a ${sentiment} review. Each voucher should have a title and description. Keep the suggestions concise and appealing.`
        },
        {
          role: "user",
          content: `Generate 3 voucher suggestions for a ${sentiment} customer review.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const suggestions = response.choices[0].message.content;
    
    // Parse the suggestions into structured data
    const vouchers = suggestions.split('\n\n').map(suggestion => {
      const [title, ...descriptionParts] = suggestion.split('\n');
      return {
        title: title.replace(/^\d+\.\s*/, '').trim(),
        description: descriptionParts.join(' ').trim(),
        sentiment
      };
    }).slice(0, 3);

    return new Response(
      JSON.stringify({ vouchers }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in suggest-vouchers function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});