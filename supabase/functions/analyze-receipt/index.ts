// @ts-ignore
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore
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
    const { imageUrl } = await req.json();
    console.log('Processing receipt image:', imageUrl);

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a receipt analysis expert. Extract the following information from the receipt image and format your response EXACTLY as a JSON object with this structure:
{
  "total_amount": number,
  "items": [
    {
      "name": string,
      "price": number
    }
  ]
}
Do not include any additional text, explanation, or markdown formatting. Only return the raw JSON object.`
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0
    };

    console.log('Sending request to OpenAI:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        // @ts-ignore
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status}\nResponse: ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data, null, 2));

    let analysis;
    try {
      const content = data.choices[0].message.content;
      console.log('Raw content from OpenAI:', content);
      
      // Clean the content by removing any markdown formatting and extra whitespace
      const cleanContent = content
        .replace(/```json\n?|\n?```/g, '')
        .replace(/^\s+|\s+$/g, '');
      console.log('Cleaned content:', cleanContent);
      
      // Try to parse the cleaned content as JSON
      try {
        analysis = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Content that failed to parse:', cleanContent);
        throw new Error(`Failed to parse OpenAI response as JSON: ${parseError.message}`);
      }

      // Validate the required fields
      if (typeof analysis.total_amount !== 'number') {
        throw new Error('Invalid total_amount: must be a number');
      }
      
      if (!Array.isArray(analysis.items)) {
        throw new Error('Invalid items: must be an array');
      }

      // Validate each item in the items array
      analysis.items.forEach((item: any, index: number) => {
        if (typeof item.name !== 'string') {
          throw new Error(`Invalid item name at index ${index}: must be a string`);
        }
        if (typeof item.price !== 'number') {
          throw new Error(`Invalid item price at index ${index}: must be a number`);
        }
      });

    } catch (error) {
      console.error('Error processing OpenAI response:', error);
      throw new Error(`Failed to process OpenAI response: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-receipt function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to analyze receipt',
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});