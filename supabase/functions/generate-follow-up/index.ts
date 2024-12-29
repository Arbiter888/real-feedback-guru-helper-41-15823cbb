// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { formatTipHistory } from "./utils";

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
  metadata?: {
    tips?: any;
  };
}

function wrapEmailContent(content: string, restaurantInfo: ReviewData['restaurantInfo']): string {
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
    const requestData = await req.json();
    console.log('Received request data:', requestData);

    if (!requestData.customerName || !requestData.restaurantInfo?.restaurantName) {
      throw new Error("Missing required fields");
    }

    const data: ReviewData = requestData;
    const supabaseClient = createClient(
      // @ts-ignore
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch menu data
    const { data: menuVersions } = await supabaseClient
      .from('restaurant_menu_versions')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    const menuData = menuVersions?.analysis;

    // Generate personalized recommendations based on previous orders
    let recommendations = [];
    if (data.receiptData?.items) {
      const orderedCategories = new Set(
        data.receiptData.items.map(item => 
          menuData?.sections?.find(section => 
            section.items.some(menuItem => 
              menuItem.name.toLowerCase().includes(item.name.toLowerCase())
            )
          )?.name
        ).filter(Boolean)
      );

      recommendations = menuData?.sections
        ?.filter(section => !orderedCategories.has(section.name))
        .flatMap(section => section.items)
        .slice(0, 2) || [];
    }

    // Include tip history in the prompt
    const tipHistory = data.metadata?.tips ? formatTipHistory(data.metadata.tips) : '';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        // @ts-ignore
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating personalized thank you emails for restaurant customers. 
            Include specific menu recommendations based on their previous orders and available menu items.
            If they have a tipping history, acknowledge their generosity and mention their rewards.
            
            IMPORTANT FORMATTING RULES:
            - Use HTML tags for formatting
            - Keep paragraphs concise
            - Include specific menu recommendations
            - Reference ordered items when available
            - Suggest complementary dishes
            - Mention tip rewards if available`
          },
          {
            role: 'user',
            content: `Generate a thank you email for ${data.customerName} who visited ${data.restaurantInfo.restaurantName}.
            ${data.reviewText ? `Their review: "${data.reviewText}"` : ''}
            ${data.refinedReview ? `Enhanced review: "${data.refinedReview}"` : ''}
            ${data.serverName ? `Server name: ${data.serverName}` : ''}
            ${data.receiptData ? `Order details: ${JSON.stringify(data.receiptData)}` : ''}
            ${data.voucherDetails ? `Offer: ${JSON.stringify(data.voucherDetails)}` : ''}
            ${tipHistory}
            Available menu items: ${JSON.stringify(menuData)}
            Recommended items: ${JSON.stringify(recommendations)}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    console.log('AI Response:', aiResponse);

    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error("Failed to generate email content");
    }

    const generatedContent = aiResponse.choices[0].message.content;
    const formattedEmail = wrapEmailContent(generatedContent, data.restaurantInfo);

    const emailData = {
      email_subject: `Thank you for visiting ${data.restaurantInfo.restaurantName}!`,
      email_content: formattedEmail,
      voucher_details: data.voucherDetails ? {
        ...data.voucherDetails,
        code: `THANK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      } : undefined
    };

    return new Response(
      JSON.stringify(emailData),
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
