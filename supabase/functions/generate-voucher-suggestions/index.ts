import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { review } = await req.json();

    const configuration = new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
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

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert specializing in restaurant customer retention.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const suggestions = JSON.parse(completion.data.choices[0].message?.content || "[]");

    return new Response(
      JSON.stringify({ suggestions }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});