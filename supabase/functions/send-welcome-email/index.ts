import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  to: string;
  rewardCode: string;
  restaurantName: string;
  googleMapsUrl?: string;
  restaurantInfo?: {
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
    const { to, rewardCode, restaurantName, googleMapsUrl, restaurantInfo }: WelcomeEmailRequest = await req.json();

    console.log('Sending welcome email to:', to, 'for restaurant:', restaurantName);

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

    const contactInfo = [];
    if (restaurantInfo?.phoneNumber) {
      contactInfo.push(`<p style="margin: 8px 0;"><a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none;">📞 ${restaurantInfo.phoneNumber}</a></p>`);
    }
    if (googleMapsUrl) {
      contactInfo.push(`<p style="margin: 8px 0;"><a href="${googleMapsUrl}" style="color: #E94E87; text-decoration: none;">📍 Find us on Google Maps</a></p>`);
    }

    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #E94E87; font-size: 24px; margin-bottom: 20px;">Welcome to EatUP! 🎉</h1>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Thank you for joining EatUP! through ${restaurantName}. We're excited to have you as part of our rewards program!
        </p>

        <div style="background-color: #FFF5F8; padding: 20px; border-radius: 12px; margin: 30px 0;">
          <h2 style="color: #E94E87; font-size: 20px; margin-bottom: 15px;">Your Special Welcome Reward 🎁</h2>
          <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Show this code on your next visit:</p>
          <p style="background: white; padding: 12px; border-radius: 6px; font-size: 24px; text-align: center; font-weight: bold; color: #E94E87; margin: 15px 0;">
            ${rewardCode}
          </p>
        </div>

        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          As an EatUP! member, you'll receive:
          <ul style="color: #333; font-size: 16px; line-height: 1.6;">
            <li>Exclusive offers from ${restaurantName}</li>
            <li>Special birthday rewards</li>
            <li>Early access to seasonal menus</li>
            <li>VIP event invitations</li>
          </ul>
        </p>

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
        from: `${restaurantName} <onboarding@resend.dev>`,
        to: [to],
        subject: `Welcome to EatUP! - Your ${restaurantName} Rewards Program`,
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