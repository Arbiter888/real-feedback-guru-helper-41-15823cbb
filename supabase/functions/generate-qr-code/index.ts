import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import QRCode from "npm:qrcode";
import { createCanvas, loadImage } from "npm:canvas";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Received request:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    const { url } = await req.json();
    console.log('Generating QR code for URL:', url);

    if (!url) {
      throw new Error("URL is required");
    }

    // Create canvas for the complete image
    const canvas = createCanvas(1000, 1200);
    const ctx = canvas.getContext("2d");

    // Set white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 800,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: 'H'
    });

    // Load and draw QR code
    const qrCode = await loadImage(qrCodeDataUrl);
    const qrSize = 800;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 200;
    
    // Draw pink border around QR code
    ctx.strokeStyle = "#E94E87";
    ctx.lineWidth = 4;
    ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
    
    // Draw QR code
    ctx.drawImage(qrCode, qrX, qrY, qrSize, qrSize);

    // Add text below QR code
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#221F26";
    ctx.textAlign = "center";
    ctx.fillText("Get Rewarded for", canvas.width / 2, qrY + qrSize + 60);
    ctx.fillText("Tips & Reviews", canvas.width / 2, qrY + qrSize + 120);

    // Convert canvas to data URL
    const finalDataUrl = canvas.toDataURL("image/png");

    console.log('QR code generated successfully');

    return new Response(
      JSON.stringify({ qrCodeUrl: finalDataUrl }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating QR code:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});