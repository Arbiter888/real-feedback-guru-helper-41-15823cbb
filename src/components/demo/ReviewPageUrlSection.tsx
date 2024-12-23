import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeGenerator } from "./url-section/QRCodeGenerator";
import { PDFGenerator } from "./url-section/PDFGenerator";

interface ReviewPageUrlSectionProps {
  restaurantName: string | null;
  googleMapsUrl: string | null;
  generatedUrl: string | null;
}

export const ReviewPageUrlSection = ({
  restaurantName,
  googleMapsUrl,
  generatedUrl,
}: ReviewPageUrlSectionProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Ensure proper URL formatting
  const baseUrl = window.location.origin.replace(/:\/*$/, '').replace(/\/$/, '');
  const fullUrl = generatedUrl ? `${baseUrl}${generatedUrl}` : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({
        title: "URL copied!",
        description: "The review page URL has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the URL manually.",
        variant: "destructive",
      });
    }
  };

  if (!generatedUrl) return null;

  return (
    <div className="space-y-6 mt-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Your unique URL to share with customers:
        </h3>
        <div className="flex gap-2">
          <Input
            value={fullUrl}
            readOnly
            className="flex-1 bg-gray-50"
          />
          <Button
            onClick={handleCopyUrl}
            variant="outline"
            className="flex-shrink-0"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Your unique QR code to share with customers:
        </h3>
        <div className="flex flex-col items-center gap-4">
          {qrCodeUrl && (
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>
          )}
          <div className="flex gap-2">
            <QRCodeGenerator 
              url={fullUrl} 
              onQRGenerated={setQrCodeUrl} 
            />
            <PDFGenerator 
              url={fullUrl}
              qrCodeUrl={qrCodeUrl}
              restaurantName={restaurantName || "Business"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};