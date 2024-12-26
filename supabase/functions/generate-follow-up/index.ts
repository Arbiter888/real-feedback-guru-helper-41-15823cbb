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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewText, refinedReview, receiptData, serverName, customerName, restaurantInfo } = await req.json() as ReviewData;

    if (!reviewText || !customerName || !restaurantInfo) {
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating personalized follow-up emails for restaurant customers. 
            Create warm, engaging content that references specific details from their visit and review.
            The email should feel personal and genuine, maintaining a professional yet friendly tone.`
          },
          {
            role: 'user',
            content: `Generate a follow-up email for ${customerName} who visited ${restaurantInfo.restaurantName}.
            Their initial review: "${reviewText}"
            ${refinedReview ? `Their enhanced review: "${refinedReview}"` : ''}
            ${serverName ? `They were served by ${serverName}.` : ''}
            ${receiptData ? `They spent $${receiptData.total_amount} and ordered: ${receiptData.items.map(item => item.name).join(', ')}.` : ''}
            
            Create both a subject line and email content. Make the content personal and reference specific details from their visit.
            The email should thank them for their visit and review, and include a special offer based on their experience.`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Parse the generated content
    const subjectMatch = generatedContent.match(/Subject: (.*?)(?=\n|$)/i);
    const emailSubject = subjectMatch ? subjectMatch[1].trim() : "Thank you for visiting us!";
    const emailContent = generatedContent.replace(/Subject: .*?\n/i, '').trim();

    // Generate voucher details
    const voucherCode = `THANK${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const validDays = 30;
    
    // Create voucher details based on spend amount
    let voucherTitle = "Special Thank You Offer";
    let discountAmount = "10% off";
    
    if (receiptData?.total_amount) {
      if (receiptData.total_amount >= 100) {
        discountAmount = "20% off";
      } else if (receiptData.total_amount >= 50) {
        discountAmount = "15% off";
      }
    }

    const voucherDetails = {
      code: voucherCode,
      title: voucherTitle,
      description: `Enjoy ${discountAmount} on your next visit`,
      validDays: validDays,
    };

    // Schedule the follow-up email for 24 hours from now
    const scheduledFor = new Date();
    scheduledFor.setHours(scheduledFor.getHours() + 24);

    // Insert the follow-up email with all components
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