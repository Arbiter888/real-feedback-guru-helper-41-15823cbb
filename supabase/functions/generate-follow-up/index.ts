import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewData {
  reviewText: string;
  refinedReview?: string;
  receiptData?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
  serverName?: string;
  customerName: string;
  voucherDetails?: {
    title: string;
    description: string;
    validDays: number;
    discountValue: string;
  };
  restaurantInfo: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    googleMapsUrl?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewText, refinedReview, receiptData, serverName, customerName, voucherDetails, restaurantInfo } = await req.json() as ReviewData;

    if (!reviewText || !customerName || !restaurantInfo) {
      throw new Error("Missing required fields");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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
            content: `You are an expert at creating personalized follow-up emails for restaurant customers. 
            Create warm, engaging content that references specific details from their visit and review.
            The email should feel personal and genuine, maintaining a professional yet friendly tone.
            If a voucher is included, make it a central part of the thank you message.`
          },
          {
            role: 'user',
            content: `Generate a follow-up email for ${customerName} who visited ${restaurantInfo.restaurantName}.
            Their initial review: "${reviewText}"
            ${refinedReview ? `Their enhanced review: "${refinedReview}"` : ''}
            ${serverName ? `They were served by ${serverName}.` : ''}
            ${receiptData ? `They spent $${receiptData.total_amount} and ordered: ${receiptData.items.map(item => item.name).join(', ')}.` : ''}
            ${voucherDetails ? `Include this special offer: ${voucherDetails.title} - ${voucherDetails.description} (${voucherDetails.discountValue})` : ''}
            
            Create both a subject line and email content. Make the content personal and reference specific details from their visit.
            The email should thank them for their visit and review.
            ${voucherDetails ? 'Make the voucher offer a highlight of the email.' : ''}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    const subjectMatch = generatedContent.match(/Subject: (.*?)(?=\n|$)/i);
    const emailSubject = subjectMatch ? subjectMatch[1].trim() : "Thank you for visiting us!";
    const emailContent = generatedContent.replace(/Subject: .*?\n/i, '').trim();

    const voucherCode = voucherDetails ? `THANK${Math.random().toString(36).substring(2, 8).toUpperCase()}` : undefined;
    
    const followUpEmail = {
      email_subject: emailSubject,
      email_content: emailContent,
      voucher_details: voucherDetails ? {
        ...voucherDetails,
        code: voucherCode,
      } : undefined,
      scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    };

    const { data: insertedEmail, error: insertError } = await supabaseClient
      .from('follow_up_emails')
      .insert(followUpEmail)
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify(insertedEmail),
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