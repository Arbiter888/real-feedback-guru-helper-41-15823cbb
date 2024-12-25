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

    // Construct the prompt based on review and receipt data
    let prompt = `Based on this customer review: "${review.text}"`;
    
    if (review.receiptData) {
      prompt += `\nTheir spending data shows they spent $${review.receiptData.total_amount}.`;
    }
    
    if (review.serverName) {
      prompt += `\nThey were served by ${review.serverName}.`;
    }

    prompt += `\n\nGenerate a sequence of 3 personalized voucher suggestions that would be effective for this customer. Consider their spending habits, review sentiment, and create a progression of offers that would encourage repeat visits.

    For each voucher suggestion, provide:
    1. A compelling title
    2. A brief description
    3. Recommended timing for sending the voucher

    Format the response as a JSON array with objects containing 'title', 'description', and 'timing' fields.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert specializing in restaurant customer retention. Generate personalized voucher suggestions in JSON format.",
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
      suggestions = JSON.parse(content);
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error('Failed to parse suggestions from OpenAI response');
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