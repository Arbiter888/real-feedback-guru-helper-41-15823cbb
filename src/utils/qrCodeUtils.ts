import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";

export const generateAndUploadQRCode = async (content: string): Promise<string> => {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(content, {
      width: 1000,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Convert data URL to Blob
    const response = await fetch(qrCodeDataUrl);
    const blob = await response.blob();
    const file = new File([blob], `qr-${Date.now()}.png`, { type: 'image/png' });

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('qr_codes')
      .upload(`${crypto.randomUUID()}.png`, file, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('qr_codes')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error generating and uploading QR code:', error);
    throw error;
  }
};