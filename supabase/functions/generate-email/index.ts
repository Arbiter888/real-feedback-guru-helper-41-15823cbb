import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const systemPrompt = `You are an expert email marketer. Generate both a compelling subject line and engaging HTML email content based on the user's prompt.
    Create responsive, well-formatted HTML that looks good on all devices. Include placeholders for images where relevant.
    
    Your response should be in this format:
    SUBJECT: [Your generated subject line here]
    
    CONTENT:
    [Your generated HTML email content here]`;

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
    const generatedText = data.choices[0].message.content;

    // Extract subject and content using regex
    const subjectMatch = generatedText.match(/SUBJECT:\s*(.*?)(?=\s*CONTENT:|$)/s);
    const contentMatch = generatedText.match(/CONTENT:\s*([\s\S]*?)$/);

    const subject = subjectMatch ? subjectMatch[1].trim() : "Generated Email";
    const content = contentMatch ? contentMatch[1].trim() : generatedText;

    console.log('Generated subject:', subject);
    console.log('Generated content length:', content.length);

    return new Response(
      JSON.stringify({ subject, content }),
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