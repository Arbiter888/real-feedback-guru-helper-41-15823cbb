import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QRCodeGeneratorProps {
  url: string;
  onQRGenerated: (qrCodeUrl: string) => void;
}

export const QRCodeGenerator = ({ url, onQRGenerated }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      
      // Generate QR code as buffer
      const buffer = await QRCode.toBuffer(url, {
        width: 1000,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Create a File object from the buffer
      const file = new File([buffer], `qr-${Date.now()}.png`, { type: 'image/png' });

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

      onQRGenerated(publicUrl);
      setQrGenerated(true);
      
      toast({
        title: "QR Code generated",
        description: "Your QR code has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={generateQRCode}
        variant="outline"
        className="flex-shrink-0"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </>
        )}
      </Button>
      {!qrGenerated && (
        <p className="text-sm text-muted-foreground">
          Generate a QR code first to enable PDF download
        </p>
      )}
    </div>
  );
};