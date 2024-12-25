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
    const { prompt } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert email marketer. Generate both a subject line and email content based on the user's prompt.
            The response should be in HTML format and should be well-formatted for email viewing.
            Make sure to include both a subject line and the email content.
            Keep the tone professional but friendly.`
          },
          { 
            role: 'user', 
            content: `Generate an email with the following requirements:
            ${prompt}
            
            Format your response exactly like this:
            SUBJECT: [Your subject line here]
            
            CONTENT:
            [Your HTML email content here]` 
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    const generatedText = data.choices[0].message.content;
    
    // Extract subject and content using regex
    const subjectMatch = generatedText.match(/SUBJECT:\s*(.*?)(?=\s*CONTENT:|$)/s);
    const contentMatch = generatedText.match(/CONTENT:\s*([\s\S]*?)$/);

    const subject = subjectMatch ? subjectMatch[1].trim() : "Generated Email";
    const content = contentMatch ? contentMatch[1].trim() : generatedText;

    console.log('Extracted subject:', subject);
    console.log('Extracted content length:', content.length);

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