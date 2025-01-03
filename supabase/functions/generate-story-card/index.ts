import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StoryCardRequest {
  qrCodeUrl: string;
  restaurantName: string;
  referrerName: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { qrCodeUrl, restaurantName, referrerName }: StoryCardRequest = await req.json();

    // Generate HTML for the story card
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Instagram Story - ${restaurantName}</title>
          <style>
            body {
              margin: 0;
              width: 1080px;
              height: 1920px;
              background: linear-gradient(45deg, #E94E87, #FF8C69);
              font-family: system-ui, -apple-system, sans-serif;
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 60px;
              box-sizing: border-box;
            }
            .container {
              text-align: center;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border-radius: 40px;
              padding: 60px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            .logo {
              width: 200px;
              height: 200px;
              margin-bottom: 40px;
            }
            .title {
              font-size: 72px;
              font-weight: bold;
              margin-bottom: 30px;
            }
            .subtitle {
              font-size: 36px;
              margin-bottom: 60px;
            }
            .qr-code {
              width: 400px;
              height: 400px;
              margin: 40px auto;
              background: white;
              padding: 20px;
              border-radius: 20px;
            }
            .footer {
              font-size: 32px;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="title">${restaurantName}</div>
            <div class="subtitle">Scan to get your welcome offer!</div>
            <img src="${qrCodeUrl}" alt="Referral QR Code" class="qr-code">
            <div class="footer">Recommended by ${referrerName}</div>
          </div>
        </body>
      </html>
    `;

    // Create a downloadable page URL
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const fileName = `story-${Date.now()}.html`;
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

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating story card:', error);
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