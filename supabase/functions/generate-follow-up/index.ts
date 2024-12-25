import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    const { reviewId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get review details
    const { data: review, error: reviewError } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (reviewError) throw reviewError;

    // Format receipt items for the prompt if available
    let receiptContext = '';
    if (review.receipt_data) {
      const items = review.receipt_data.items.map((item: any) => 
        `${item.name} ($${item.price})`
      ).join(', ');
      receiptContext = `\nThe customer ordered: ${items}\nTotal spent: $${review.receipt_data.total_amount}`;
    }

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
            content: 'You are an expert at creating personalized follow-up emails and special offers for restaurant customers based on their reviews and order history. Create warm, engaging emails that reference specific items they ordered and their experience.'
          },
          {
            role: 'user',
            content: `Generate a follow-up email for a customer who left this review: "${review.review_text}"${receiptContext}
            ${review.server_name ? `\nTheir server was: ${review.server_name}` : ''}
            
            Include:
            1. A personalized subject line
            2. A warm greeting
            3. References to specific items they ordered (if available)
            4. A thank you for their visit
            5. An invitation to return
            
            Format the response with "Subject:" on the first line, followed by the email content.`
          }
        ],
      }),
    });

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Parse the generated content
    const subjectMatch = generatedContent.match(/Subject: (.*?)(?=\n|$)/i);
    const emailSubject = subjectMatch ? subjectMatch[1].trim() : "Thank you for your visit";
    const emailContent = generatedContent.replace(/Subject: .*?\n/i, '').trim();

    // Generate voucher details
    const voucherDetails = {
      code: `THANK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      title: review.receipt_data ? 
        `${Math.round(review.receipt_data.total_amount * 0.2)}% off your next visit` :
        "20% off your next visit",
      validDays: 30,
    };

    // Schedule the follow-up email for 24 hours after the review
    const scheduledFor = new Date(review.created_at);
    scheduledFor.setHours(scheduledFor.getHours() + 24);

    // Insert the follow-up email
    const { data: followUpEmail, error: insertError } = await supabaseClient
      .from('follow_up_emails')
      .insert({
        review_id: reviewId,
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