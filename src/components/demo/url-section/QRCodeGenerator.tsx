import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAndUploadQRCode } from "@/utils/qrCodeUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QRCodeGeneratorProps {
  url: string;
  onQRGenerated: (qrCodeUrl: string) => void;
}

export const QRCodeGenerator = ({ url, onQRGenerated }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const [qrGenerated, setQrGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);
      // Generate a referral URL that includes the restaurant context
      const referralUrl = `${window.location.origin}/referral?restaurant=${encodeURIComponent(url)}`;
      const generatedQrCodeUrl = await generateAndUploadQRCode(referralUrl);
      setQrCodeUrl(generatedQrCodeUrl);
      onQRGenerated(generatedQrCodeUrl);
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

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'eatup-qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate a QR code for your review page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {qrGenerated && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download QR code as PNG image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {!qrGenerated && (
        <p className="text-sm text-muted-foreground">
          Generate a QR code first to enable downloads
        </p>
      )}
    </div>
  );
};