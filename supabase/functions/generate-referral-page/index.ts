import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReferralPageRequest {
  referralCode: string;
  restaurantName: string;
  qrCodeUrl: string;
  restaurantLogo?: string;
  expirationDate?: string;
  termsAndConditions?: string;
  starsCount?: number;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      referralCode,
      restaurantName,
      qrCodeUrl,
      restaurantLogo,
      expirationDate,
      termsAndConditions,
      starsCount
    }: ReferralPageRequest = await req.json();

    // Generate HTML for the downloadable page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Referral - ${restaurantName}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 40px;
              background: white;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              text-align: center;
            }
            .logo {
              max-width: 200px;
              margin-bottom: 20px;
            }
            .qr-code {
              width: 300px;
              height: 300px;
              margin: 20px auto;
            }
            .cta {
              font-size: 24px;
              color: #E94E87;
              margin: 20px 0;
            }
            .benefits {
              text-align: left;
              margin: 20px auto;
              max-width: 400px;
            }
            .benefits li {
              margin: 10px 0;
            }
            .footer {
              margin-top: 40px;
              font-size: 14px;
              color: #666;
            }
            .stars {
              display: flex;
              justify-content: center;
              gap: 10px;
              margin: 20px 0;
              font-size: 24px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${restaurantLogo ? `<img src="${restaurantLogo}" alt="${restaurantName}" class="logo">` : ''}
            <h1>Scan for a treat at ${restaurantName}!</h1>
            <img src="${qrCodeUrl}" alt="Referral QR Code" class="qr-code">
            <div class="cta">Share and Earn Rewards!</div>
            <div class="benefits">
              <h3>Your friends will receive:</h3>
              <ul>
                <li>A special welcome voucher</li>
                <li>Exclusive first-time visitor perks</li>
              </ul>
            </div>
            ${starsCount !== undefined ? `
              <div class="stars">
                ${Array(3).fill(0).map((_, i) => i < starsCount ? '⭐' : '☆').join('')}
              </div>
              <p>Collect stars by referring friends!</p>
            ` : ''}
            ${expirationDate ? `
              <div class="footer">
                Valid until: ${expirationDate}<br>
                ${termsAndConditions || ''}
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `;

    // Create a downloadable page URL
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const fileName = `${referralCode}-page.html`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('qr_codes')
      .upload(fileName, html, {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('qr_codes')
      .getPublicUrl(fileName);

    // Update the referral code record with the download page URL
    const { error: updateError } = await supabase
      .from('referral_codes')
      .update({ download_page_url: publicUrl })
      .eq('code', referralCode);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ downloadUrl: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating referral page:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});