import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, tipAmount, tipReward, reviewRewardCode, serverName } = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #E94E87; text-align: center;">Welcome to EatUP! Rewards! 🎉</h1>
        
        <div style="margin: 30px 0; padding: 20px; background: #FFF5F8; border-radius: 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Rewards:</h2>
          
          ${tipAmount ? `
            <div style="margin-bottom: 25px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #FFD5E2;">
              <h3 style="color: #E94E87; margin-top: 0;">Tip Reward</h3>
              <p>Thank you for tipping ${serverName} £${tipAmount}!</p>
              <p style="font-size: 18px; font-weight: bold;">Your Reward: £${tipReward.toFixed(2)}</p>
              <div style="background: #F8F8F8; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <p style="margin: 0; font-family: monospace; font-size: 16px; color: #E94E87;">TIP${tipAmount}BACK</p>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">Valid for 30 days</p>
            </div>
          ` : ''}
          
          ${reviewRewardCode ? `
            <div style="margin-bottom: 25px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #FFD5E2;">
              <h3 style="color: #E94E87; margin-top: 0;">Review Completion Reward</h3>
              <p>Thank you for sharing your experience!</p>
              <div style="background: #F8F8F8; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <p style="margin: 0; font-family: monospace; font-size: 16px; color: #E94E87;">${reviewRewardCode}</p>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">Valid for 30 days</p>
            </div>
          ` : ''}
        </div>
        
        <p style="text-align: center; color: #666;">
          Show these codes on your next visit to redeem your rewards!
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EatUP! Rewards <rewards@eatup.co>",
        to: [email],
        subject: "Your EatUP! Rewards Are Here! 🎁",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    const data = await res.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending rewards email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});