import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";

export const generateAndUploadQRCode = async (content: string): Promise<string> => {
  try {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Set canvas size with extra space for logo and text
    canvas.width = 1000;
    canvas.height = 1200;

    // Generate QR code with margin
    const qrCodeDataUrl = await QRCode.toDataURL(content, {
      width: 1000,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Create temporary image to draw QR code
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = qrCodeDataUrl;
    });

    // Draw white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code
    ctx.drawImage(img, 0, 0);

    // Load and draw EatUP! logo
    const logo = new Image();
    await new Promise((resolve, reject) => {
      logo.onload = resolve;
      logo.onerror = reject;
      logo.src = "/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png";
    });

    // Calculate logo position (centered, above QR code)
    const logoWidth = 300;
    const logoHeight = 100;
    const logoX = (canvas.width - logoWidth) / 2;
    const logoY = 20;

    // Draw logo
    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

    // Add text below QR code
    ctx.fillStyle = "#000000";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Get Rewarded for", canvas.width / 2, 1080);
    ctx.fillText("Tips & Reviews", canvas.width / 2, 1140);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/png");
    });

    const file = new File([blob], `qr-${Date.now()}.png`, { type: "image/png" });

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("qr_codes")
      .upload(`${crypto.randomUUID()}.png`, file, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("qr_codes")
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error generating and uploading QR code:", error);
    throw error;
  }
};