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
    const { prompt, imageUrls, subjectOnly, contentOnly, htmlOnly, restaurantInfo } = await req.json();

    let systemPrompt = "";
    if (subjectOnly) {
      systemPrompt = `You are an expert email marketer for ${restaurantInfo?.restaurantName || 'the restaurant'}. Generate a compelling subject line based on the user's prompt.`;
    } else if (contentOnly) {
      systemPrompt = `You are an expert email marketer for ${restaurantInfo?.restaurantName || 'the restaurant'}. Generate engaging plain text email content based on the user's prompt. Do not include any HTML formatting.

      Important context about the restaurant:
      - Restaurant Name: ${restaurantInfo?.restaurantName || 'the restaurant'}
      
      IMPORTANT GUIDELINES:
      1. DO NOT use placeholders like [Your Name] or [Restaurant Name]
      2. DO NOT include contact information, website URLs, or social media links in the email body
      3. Always end the email with "Warm regards," followed by a new line and "${restaurantInfo?.restaurantName || 'The Team'}"
      4. The contact information and social links will be automatically added in a signature block`;
    } else if (htmlOnly) {
      systemPrompt = `You are an expert email marketer for ${restaurantInfo?.restaurantName || 'the restaurant'}. Convert the given plain text email into responsive HTML format that looks good on all devices. Use modern email-safe HTML and CSS.`;
    } else {
      systemPrompt = `You are an expert email marketer for ${restaurantInfo?.restaurantName || 'the restaurant'}. Generate both a compelling subject line and engaging email content based on the user's prompt.
      
      Important context about the restaurant:
      - Restaurant Name: ${restaurantInfo?.restaurantName || 'the restaurant'}
      
      IMPORTANT GUIDELINES:
      1. DO NOT use placeholders like [Your Name] or [Restaurant Name]
      2. DO NOT include contact information, website URLs, or social media links in the email body
      3. Always end the email with "Warm regards," followed by a new line and "${restaurantInfo?.restaurantName || 'The Team'}"
      4. The contact information and social links will be automatically added in a signature block
      
      Your response should be in this format:
      SUBJECT: [Your generated subject line here]
      
      CONTENT:
      [Your generated email content here]`;
    }

    let imageContext = "";
    if (imageUrls && imageUrls.length > 0) {
      imageContext = "Based on the provided images: " + imageUrls.join(", ");
    }

    console.log('Generating email with context:', {
      restaurantInfo,
      prompt,
      systemPrompt
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${imageContext}\n\n${prompt}` }
        ],
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    let result;
    if (subjectOnly) {
      result = { subject: generatedText.trim() };
    } else if (contentOnly || htmlOnly) {
      result = { content: generatedText.trim() };
    } else {
      const subjectMatch = generatedText.match(/SUBJECT:\s*(.*?)(?=\s*CONTENT:|$)/s);
      const contentMatch = generatedText.match(/CONTENT:\s*([\s\S]*?)$/);

      result = {
        subject: subjectMatch ? subjectMatch[1].trim() : "Generated Email",
        content: contentMatch ? contentMatch[1].trim() : generatedText
      };
    }

    console.log('Generated result:', result);

    return new Response(
      JSON.stringify(result),
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