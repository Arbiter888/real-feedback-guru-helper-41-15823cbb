import { supabase } from "@/integrations/supabase/client";

export const generateAndUploadQRCode = async (content: string): Promise<string> => {
  try {
    console.log('Generating QR code for content:', content);
    
    // Call the Edge Function to generate QR code with custom styling
    const { data, error } = await supabase.functions.invoke("generate-qr-code", {
      body: { 
        url: content,
        options: {
          width: 800,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: 'H'
        }
      }
    });

    if (error) {
      console.error('Error from Edge Function:', error);
      throw error;
    }

    if (!data?.qrCodeUrl) {
      throw new Error('No QR code URL received from server');
    }

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

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("qr_codes")
      .getPublicUrl(uploadData.path);

    console.log('Successfully generated and uploaded QR code:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error generating and uploading QR code:", error);
    throw error;
  }
};