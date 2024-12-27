import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  url: string;
  onQRGenerated: (qrCodeUrl: string) => void;
}

export const QRCodeGenerator = ({ url, onQRGenerated }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 1000,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      onQRGenerated(qrDataUrl);
      setQrGenerated(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={generateQRCode}
        variant="outline"
        className="flex-shrink-0"
      >
        <QrCode className="h-4 w-4 mr-2" />
        Generate QR Code
      </Button>
      {!qrGenerated && (
        <p className="text-sm text-muted-foreground">
          Generate a QR code first to enable PDF download
        </p>
      )}
    </div>
  );
};