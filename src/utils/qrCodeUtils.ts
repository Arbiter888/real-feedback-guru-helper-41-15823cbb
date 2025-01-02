import { supabase } from "@/integrations/supabase/client";

export const generateAndUploadQRCode = async (content: string): Promise<string> => {
  try {
    // Call the Edge Function to generate QR code
    const { data, error } = await supabase.functions.invoke("generate-qr-code", {
      body: { url: content }
    });

    if (error) throw error;

    // Convert base64 to blob
    const response = await fetch(data.qrCodeUrl);
    const blob = await response.blob();
    const file = new File([blob], `qr-${Date.now()}.png`, { type: "image/png" });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("qr_codes")
      .upload(`${crypto.randomUUID()}.png`, file, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("qr_codes")
      .getPublicUrl(uploadData.path);

    return publicUrl;
  } catch (error) {
    console.error("Error generating and uploading QR code:", error);
    throw error;
  }
};