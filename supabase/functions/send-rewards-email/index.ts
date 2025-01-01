import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailRequest {
  email: string;
  tipAmount?: number;
  tipReward?: number;
  tipRewardCode?: string;
  reviewRewardCode?: string;
  restaurantInfo?: {
    restaurantName: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    phoneNumber?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      tipAmount, 
      tipReward, 
      tipRewardCode,
      reviewRewardCode,
      restaurantInfo 
    }: EmailRequest = await req.json();

    // Calculate expiration date (30 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const formattedExpirationDate = expirationDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const socialLinks = [];
    if (restaurantInfo?.websiteUrl) {
      socialLinks.push(`<a href="${restaurantInfo.websiteUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px;">Visit our Website</a>`);
    }
    if (restaurantInfo?.facebookUrl) {
      socialLinks.push(`<a href="${restaurantInfo.facebookUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px;">Follow us on Facebook</a>`);
    }
    if (restaurantInfo?.instagramUrl) {
      socialLinks.push(`<a href="${restaurantInfo.instagramUrl}" style="color: #E94E87; text-decoration: none;">Follow us on Instagram</a>`);
    }

    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">
          Your EatUP! Rewards Are Here! 🎉
        </h1>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
          Thank you for sharing your dining experience! We've prepared your rewards for both today and your next visit.
        </p>

        <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
          <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px; text-align: center;">
            Your Review Reward for Next Visit ⭐
          </h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px dashed #E94E87; margin: 20px 0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Present this code on your next visit:</p>
            <p style="background: #FFF5F8; padding: 12px; border-radius: 6px; font-size: 24px; font-weight: bold; color: #E94E87; margin: 15px 0;">
              ${reviewRewardCode}
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              Get 10% off your next meal!<br>
              Valid until ${formattedExpirationDate}
            </p>
          </div>
        </div>

        ${tipRewardCode ? `
          <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
            <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px; text-align: center;">
              Your Additional Tip Credit 🎁
            </h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px dashed #E94E87; margin: 20px 0;">
              <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Present this code along with your review reward:</p>
              <p style="background: #FFF5F8; padding: 12px; border-radius: 6px; font-size: 24px; font-weight: bold; color: #E94E87; margin: 15px 0;">
                ${tipRewardCode}
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 10px;">
                Valid until ${formattedExpirationDate}
              </p>
            </div>

            <p style="color: #333; font-size: 16px; text-align: center; margin-top: 20px;">
              That's an additional <strong>£${tipReward?.toFixed(2)}</strong> off your next meal!
            </p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
          <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">Stay Connected</h3>
          <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
            Follow us for more exclusive offers and updates!
          </p>
          <div style="margin-bottom: 20px;">
            ${socialLinks.join(' • ')}
          </div>
          ${restaurantInfo?.phoneNumber ? `
            <p style="color: #666; font-size: 14px;">
              To make a reservation, call us at: <a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none;">${restaurantInfo.phoneNumber}</a>
            </p>
          ` : ''}
        </div>
      </div>
    `;

    console.log("Sending email to:", email);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EatUP! Rewards <rewards@eatup.co>",
        to: [email],
        subject: `Your EatUP! Rewards Are Here! 🎁`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error sending rewards email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);