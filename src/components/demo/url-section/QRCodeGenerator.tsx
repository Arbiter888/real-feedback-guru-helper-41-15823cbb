import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAndUploadQRCode } from "@/utils/qrCodeUtils";

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
      const qrCodeUrl = await generateAndUploadQRCode(url);
      onQRGenerated(qrCodeUrl);
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