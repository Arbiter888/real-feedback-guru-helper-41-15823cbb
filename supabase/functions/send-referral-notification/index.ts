import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  referrerEmail: string;
  referrerName: string;
  refereeName: string;
  restaurantName: string;
  currentStars: number;
  rewardCode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      referrerEmail,
      referrerName,
      refereeName,
      restaurantName,
      currentStars,
      rewardCode,
    }: NotificationRequest = await req.json();

    let emailContent: string;
    let emailSubject: string;

    if (rewardCode) {
      // They've earned a reward
      emailSubject = `🎉 Congratulations! You've earned a reward at ${restaurantName}!`;
      emailContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
            You've Earned a Reward! 🌟
          </h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi ${referrerName},<br><br>
            Amazing news! You've collected 3 stars by referring friends to ${restaurantName}. 
            As a thank you, here's your special reward:
          </p>

          <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <p style="background: white; padding: 12px; border-radius: 6px; font-size: 24px; text-align: center; font-weight: bold; color: #E94E87; margin: 15px 0;">
              ${rewardCode}
            </p>
            <p style="color: #666; font-size: 14px; text-align: center;">
              Show this code on your next visit to claim your reward!
            </p>
          </div>

          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Keep sharing the love! You can start collecting stars again for your next reward.
          </p>
        </div>
      `;
    } else {
      // Regular referral notification
      emailSubject = `${refereeName} just joined EatUP! through your referral!`;
      emailContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
            You've Earned a Star! ⭐
          </h1>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi ${referrerName},<br><br>
            Great news! ${refereeName} just signed up for EatUP! using your referral link for ${restaurantName}.
          </p>

          <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Your Progress</h2>
            <p style="color: #333; font-size: 16px; text-align: center; margin-bottom: 10px;">
              ${currentStars}/3 stars collected
            </p>
            <div style="display: flex; justify-content: center; gap: 10px; margin: 15px 0;">
              ${Array(3).fill(0).map((_, i) => 
                i < currentStars 
                  ? '⭐' 
                  : '☆'
              ).join('')}
            </div>
            <p style="color: #666; font-size: 14px; text-align: center;">
              ${3 - currentStars} more ${3 - currentStars === 1 ? 'referral' : 'referrals'} until your next reward!
            </p>
          </div>

          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Keep sharing your referral link to earn more rewards!
          </p>
        </div>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${restaurantName} <onboarding@resend.dev>`,
        to: [referrerEmail],
        subject: emailSubject,
        html: emailContent,
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
    console.error("Error sending referral notification:", error);
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