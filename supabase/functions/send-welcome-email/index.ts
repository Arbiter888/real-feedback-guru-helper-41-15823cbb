// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// @ts-ignore
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// @ts-ignore
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
// @ts-ignore
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  to: string;
  firstName: string;
  rewardCode: string | null;
  tipRewardCode: string | null;
  tipAmount: number | null;
  tipReward: number | null;
  restaurantInfo: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
    googleMapsUrl?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { 
      to, 
      firstName, 
      rewardCode, 
      tipRewardCode, 
      tipAmount, 
      tipReward,
      restaurantInfo 
    }: WelcomeEmailRequest = await req.json();

    console.log('Generating referral code for:', to, 'at restaurant:', restaurantInfo.restaurantName);

    // Generate referral code
    const code = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).substring(2, 7)}`;
    const referralUrl = `${new URL(req.url).origin}/referral/${code}`;
    
    // Generate QR code using existing edge function
    const { data: qrData } = await supabase.functions.invoke('generate-qr-code', {
      body: { url: referralUrl }
    });

    // Create referral code record
    const { error: referralError } = await supabase
      .from('referral_codes')
      .insert({
        referrer_name: firstName,
        referrer_email: to,
        restaurant_name: restaurantInfo.restaurantName,
        code: code,
        qr_code_url: qrData.qrCodeUrl,
        referral_url: referralUrl,
        restaurant_info: restaurantInfo,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
      });

    if (referralError) throw referralError;

    // Generate mystery voucher code
    const mysteryVoucherCode = `MYSTERY-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const socialLinks = [];
    if (restaurantInfo.websiteUrl) {
      socialLinks.push(`<a href="${restaurantInfo.websiteUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px;">Visit our Website</a>`);
    }
    if (restaurantInfo.facebookUrl) {
      socialLinks.push(`<a href="${restaurantInfo.facebookUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px;">Follow us on Facebook</a>`);
    }
    if (restaurantInfo.instagramUrl) {
      socialLinks.push(`<a href="${restaurantInfo.instagramUrl}" style="color: #E94E87; text-decoration: none;">Follow us on Instagram</a>`);
    }

    const contactInfo = [];
    if (restaurantInfo.phoneNumber) {
      contactInfo.push(`<p style="margin: 8px 0;"><a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none;">📞 ${restaurantInfo.phoneNumber}</a></p>`);
    }
    if (restaurantInfo.googleMapsUrl) {
      contactInfo.push(`<p style="margin: 8px 0;"><a href="${restaurantInfo.googleMapsUrl}" style="color: #E94E87; text-decoration: none;">📍 Find us on Google Maps</a></p>`);
    }

    // Calculate expiration date (30 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const formattedExpirationDate = expirationDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
          Welcome to EatUP!, ${firstName}! 🎉
        </h1>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
          Thanks for dining with us at ${restaurantInfo.restaurantName}! We hope you enjoyed your 10% discount today.
          We've prepared some additional rewards for your next visit!
        </p>

        ${tipRewardCode ? `
        <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
          <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Your Next Visit Tip Reward 🎁</h2>
          <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
            Thanks for your generous £${tipAmount?.toFixed(2)} tip! Here's your £${tipReward?.toFixed(2)} reward for your next visit:
          </p>
          <p style="background: white; padding: 12px; border-radius: 6px; font-size: 24px; text-align: center; font-weight: bold; color: #E94E87; margin: 15px 0;">
            ${tipRewardCode}
          </p>
          <p style="color: #666; font-size: 14px; font-style: italic;">
            Valid until ${formattedExpirationDate}
          </p>
        </div>
        ` : ''}

        <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
          <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Your Mystery Reward 🎁</h2>
          <p style="color: #333; font-size: 16px; margin-bottom: 10px;">
            We've got a special surprise waiting for you on your next visit! Show this code to unlock your mystery reward:
          </p>
          <p style="background: white; padding: 12px; border-radius: 6px; font-size: 24px; text-align: center; font-weight: bold; color: #E94E87; margin: 15px 0;">
            ${mysteryVoucherCode}
          </p>
          <p style="color: #666; font-size: 14px; font-style: italic;">
            Valid until ${formattedExpirationDate}
          </p>
        </div>

        <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
          <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Share with Friends & Earn More! 🤝</h2>
          <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
            Share your personal referral link with friends and they'll get a special welcome reward when they join!
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <img src="${qrData.qrCodeUrl}" alt="Your Referral QR Code" style="width: 200px; height: 200px;" />
          </div>
          <p style="background: white; padding: 12px; border-radius: 6px; font-size: 16px; text-align: center; color: #666; margin: 15px 0; word-break: break-all;">
            ${referralUrl}
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <div style="margin-bottom: 20px;">
            ${contactInfo.join('\n')}
          </div>
          <div style="margin-top: 16px;">
            ${socialLinks.join('\n')}
          </div>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${restaurantInfo.restaurantName} <onboarding@resend.dev>`,
        to: [to],
        subject: `Welcome to EatUP! - Your ${restaurantInfo.restaurantName} Rewards`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);