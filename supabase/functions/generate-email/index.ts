import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageUrls } = await req.json();

    const systemPrompt = `You are an expert email marketer. Generate engaging HTML email content based on the user's prompt.
    Create responsive, well-formatted HTML that looks good on all devices. Include placeholders for images where relevant.
    Focus on creating compelling subject lines and content that drives engagement.`;

    let imageContext = "";
    if (imageUrls && imageUrls.length > 0) {
      imageContext = "Based on the provided images: " + imageUrls.join(", ");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${imageContext}\n\nGenerate an email: ${prompt}` }
        ],
      }),
    });

    const data = await response.json();
    const generatedEmail = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        subject: generatedEmail.match(/<subject>(.*?)<\/subject>/s)?.[1] || "Generated Email",
        content: generatedEmail.replace(/<subject>.*?<\/subject>/s, '').trim()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});