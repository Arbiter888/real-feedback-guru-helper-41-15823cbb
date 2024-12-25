import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

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
    const { review } = await req.json();

    if (!review) {
      throw new Error('Review data is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log("Processing review:", {
      text: review.text,
      receiptTotal: review.receiptData?.total_amount,
      serverName: review.serverName
    });

    const configuration = new Configuration({
      apiKey: openAIApiKey,
    });
    const openai = new OpenAIApi(configuration);

    // Construct a more structured prompt to ensure JSON response
    let prompt = `Based on this customer review: "${review.text}", generate 3 personalized voucher suggestions.`;
    
    if (review.receiptData) {
      prompt += `\nTheir spending data shows they spent $${review.receiptData.total_amount}.`;
    }
    
    if (review.serverName) {
      prompt += `\nThey were served by ${review.serverName}.`;
    }

    prompt += `\n\nProvide exactly 3 voucher suggestions in a valid JSON array format. Each suggestion should be an object with these exact fields:
    - "title": A short, compelling offer title
    - "description": A brief description of the offer
    - "timing": When to send this voucher

    Format your entire response as a JSON array like this:
    [
      {
        "title": "Example Title",
        "description": "Example Description",
        "timing": "Example Timing"
      }
    ]

    Only respond with the JSON array, no other text.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert that only responds with valid JSON arrays containing voucher suggestions. Never include any explanatory text outside the JSON structure.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.data.choices[0].message?.content || "[]";
    console.log("Raw OpenAI response:", content);

    let suggestions;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedContent = content.trim().replace(/```json\n?|\n?```/g, '');
      suggestions = JSON.parse(cleanedContent);
      
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }

      // Validate the structure of each suggestion
      suggestions.forEach((suggestion, index) => {
        if (!suggestion.title || !suggestion.description || !suggestion.timing) {
          throw new Error(`Suggestion at index ${index} is missing required fields`);
        }
      });
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.error("Raw content:", content);
      throw new Error(`Failed to parse suggestions from OpenAI response: ${error.message}`);
    }

    console.log("Generated suggestions:", suggestions);

    return new Response(
      JSON.stringify({ suggestions }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error("Error in generate-voucher-suggestions function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});