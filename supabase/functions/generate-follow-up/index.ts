import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewData {
  reviewText?: string;
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

function wrapEmailContent(content: string, restaurantInfo: ReviewData['restaurantInfo']): string {
  // Define a base style for the email content
  const emailStyle = `
    <style>
      .email-content {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      }
      .email-content p {
        margin-bottom: 16px;
      }
      .email-content strong {
        color: #333;
        font-weight: 600;
      }
      .email-content a {
        color: #E94E87;
        text-decoration: none;
      }
      .email-content .signature {
        margin-top: 32px;
        padding-top: 16px;
        border-top: 1px solid #eee;
      }
      .email-content .terms {
        margin-top: 24px;
        padding: 16px;
        background-color: #f9f9f9;
        border-radius: 8px;
      }
    </style>
  `;

  // Create the contact links section with the correct restaurant info
  const contactLinks = `
    <div class="signature">
      ${restaurantInfo.phoneNumber ? `
        <p>
          <a href="tel:${restaurantInfo.phoneNumber}">📞 ${restaurantInfo.phoneNumber}</a>
        </p>
      ` : ''}
      ${restaurantInfo.googleMapsUrl ? `
        <p>
          <a href="${restaurantInfo.googleMapsUrl}">📍 Find us on Google Maps</a>
        </p>
      ` : ''}
      <div style="margin-top: 16px;">
        ${restaurantInfo.websiteUrl ? `
          <a href="${restaurantInfo.websiteUrl}" style="margin-right: 16px;">🌐 Visit our Website</a>
        ` : ''}
        ${restaurantInfo.facebookUrl ? `
          <a href="${restaurantInfo.facebookUrl}" style="margin-right: 16px;">👥 Follow us on Facebook</a>
        ` : ''}
        ${restaurantInfo.instagramUrl ? `
          <a href="${restaurantInfo.instagramUrl}">📸 Follow us on Instagram</a>
        ` : ''}
      </div>
    </div>
  `;

  return `
    ${emailStyle}
    <div class="email-content">
      ${content}
      ${contactLinks}
    </div>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewText, refinedReview, receiptData, serverName, customerName, voucherDetails, restaurantInfo } = await req.json() as ReviewData;

    if (!customerName || !restaurantInfo) {
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating personalized thank you emails for restaurant customers. 
            Create warm, engaging content that references specific details from their visit and review.
            
            IMPORTANT FORMATTING RULES:
            - Use HTML tags for formatting (<strong>, <p>, etc.)
            - Keep paragraphs concise and readable
            - Maintain consistent restaurant branding
            - Don't include any contact information or social media links in the main content
            - Focus on the customer's specific experience and the voucher details`
          },
          {
            role: 'user',
            content: `Generate a thank you email for a customer of ${restaurantInfo.restaurantName}.
            ${reviewText ? `Their review: "${reviewText}"` : ''}
            ${refinedReview ? `Enhanced review: "${refinedReview}"` : ''}
            ${serverName ? `Server name: ${serverName}` : ''}
            ${receiptData ? `Order details: Total $${receiptData.total_amount}, Items: ${receiptData.items.map(item => item.name).join(', ')}` : ''}
            ${voucherDetails ? `Include this offer: ${voucherDetails.title} (${voucherDetails.discountValue}) - ${voucherDetails.description}` : ''}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Wrap the content with our styled template
    const formattedEmail = wrapEmailContent(generatedContent, restaurantInfo);

    const followUpEmail = {
      email_subject: `Thank you for visiting ${restaurantInfo.restaurantName}!`,
      email_content: formattedEmail,
      voucher_details: voucherDetails ? {
        ...voucherDetails,
        code: `THANK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
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