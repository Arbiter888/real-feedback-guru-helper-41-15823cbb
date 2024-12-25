import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Enhanced prompt for better sentiment-based suggestions
    let prompt = `Analyze this customer review and generate 3 personalized voucher suggestions. Review: "${review.text}"

    Consider the following:
    ${review.receiptData ? `- Customer spent $${review.receiptData.total_amount}` : ''}
    ${review.serverName ? `- They were served by ${review.serverName}` : ''}

    For each suggestion, determine the sentiment category (highly_positive, positive, neutral, or negative) and provide:
    1. A compelling offer title
    2. A detailed description
    3. Strategic timing for sending
    4. Clear reasoning for why this specific voucher matches the customer's experience

    Format your response as a JSON array with exactly these fields:
    [
      {
        "title": "Offer title",
        "description": "Detailed description",
        "timing": "When to send",
        "reasoning": "Why this voucher matches",
        "category": "sentiment_category"
      }
    ]

    Only respond with the JSON array, no other text.`;

    console.log("Sending prompt to OpenAI:", prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
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
      const cleanedContent = content.trim().replace(/```json\n?|\n?```/g, '');
      suggestions = JSON.parse(cleanedContent);
      
      if (!Array.isArray(suggestions)) {
        throw new Error('Response is not an array');
      }

      suggestions.forEach((suggestion, index) => {
        if (!suggestion.title || !suggestion.description || !suggestion.timing || !suggestion.category || !suggestion.reasoning) {
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