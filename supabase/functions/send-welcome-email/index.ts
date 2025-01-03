import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { WelcomeEmailRequest } from "./types.ts";
import { generateWelcomeEmailContent } from "./emailTemplates.ts";
import { generateReferralCode } from "./referralUtils.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { to, firstName, rewardCode, tipRewardCode, tipAmount, tipReward, restaurantInfo }: WelcomeEmailRequest = await req.json();

    // Generate mystery voucher code
    const mysteryVoucherCode = `MYSTERY-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Generate referral code and QR code
    const referralData = await generateReferralCode(
      supabase,
      firstName,
      to,
      restaurantInfo,
      new URL(req.url).origin
    );

    // Calculate expiration date (30 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const formattedExpirationDate = expirationDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Generate email content
    const htmlContent = generateWelcomeEmailContent({
      firstName,
      restaurantInfo,
      tipAmount,
      tipReward,
      tipRewardCode,
      mysteryVoucherCode,
      qrCodeUrl: referralData.qrCodeUrl,
      referralUrl: referralData.referralUrl,
      formattedExpirationDate,
    });

    // Send email using Resend
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