import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

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

  // Get the current hostname without any trailing colons
  const baseUrl = window.location.origin.replace(/:\/*$/, '');
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

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(fullUrl);
      setQrCodeUrl(qrDataUrl);
      return qrDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive",
      });
      return null;
    }
  };

  const downloadPDF = async () => {
    try {
      const qrCodeDataUrl = await generateQRCode();
      if (!qrCodeDataUrl) return;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add restaurant name
      pdf.setFontSize(20);
      pdf.text(restaurantName || 'Restaurant Review', 20, 20);

      // Add URL text
      pdf.setFontSize(12);
      pdf.text("Scan to leave a review:", 20, 40);
      pdf.text(fullUrl, 20, 50);

      // Add QR code
      pdf.addImage(qrCodeDataUrl, "PNG", 20, 60, 80, 80);

      // Save the PDF
      pdf.save(`${restaurantName || 'restaurant'}-review-page.pdf`);

      toast({
        title: "PDF Created!",
        description: "Your review page PDF has been generated with QR code.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
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
            <Button
              onClick={generateQRCode}
              variant="outline"
              className="flex-shrink-0"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
            <Button
              onClick={downloadPDF}
              variant="outline"
              className="flex-shrink-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};