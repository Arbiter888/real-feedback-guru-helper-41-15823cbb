import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateFollowUpRequest {
  reviewText: string;
  customerName: string;
  receiptData?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
  serverName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewText, customerName, receiptData, serverName } = await req.json() as GenerateFollowUpRequest;

    if (!reviewText || !customerName) {
      throw new Error("Missing required fields");
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate follow-up email content using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating personalized follow-up emails and special offers for restaurant customers based on their reviews.'
          },
          {
            role: 'user',
            content: `Generate a follow-up email and special offer for ${customerName} who left this review: "${reviewText}". Include both a subject line and email content. Make the offer personalized based on their review.${
              receiptData ? ` Consider that they spent $${receiptData.total_amount} on their visit.` : ''
            }${serverName ? ` Their server was ${serverName}.` : ''}`
          }
        ],
      }),
    });

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Parse the generated content
    const subjectMatch = generatedContent.match(/Subject: (.*?)(?=\n|$)/i);
    const emailSubject = subjectMatch ? subjectMatch[1].trim() : "Thank you for your review";
    const emailContent = generatedContent.replace(/Subject: .*?\n/i, '').trim();

    // Generate voucher details
    const voucherDetails = {
      code: `THANK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      discount: "20% off",
      validDays: 30,
    };

    // Schedule the follow-up email for 24 hours from now
    const scheduledFor = new Date();
    scheduledFor.setHours(scheduledFor.getHours() + 24);

    // Insert the follow-up email
    const { data: followUpEmail, error: insertError } = await supabaseClient
      .from('follow_up_emails')
      .insert({
        email_subject: emailSubject,
        email_content: emailContent,
        voucher_details: voucherDetails,
        scheduled_for: scheduledFor.toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify(followUpEmail),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-follow-up function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});