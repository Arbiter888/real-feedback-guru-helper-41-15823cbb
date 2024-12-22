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
      const qrDataUrl = await QRCode.toDataURL(fullUrl, {
        width: 1000,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
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

      // Create PDF with custom dimensions (in mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add pink header background
      pdf.setFillColor(233, 78, 135); // EatUp pink
      pdf.rect(0, 0, 210, 40, 'F');

      // Add white "EatUp" text in header
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.text("EatUp", 20, 28);

      // Add tagline
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Share your dining experience", 90, 28);

      // Restaurant name
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(restaurantName || "Our Restaurant", 20, 60);

      // Main call to action
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text("Scan to share your experience", 20, 75);
      
      // Subtitle
      pdf.setFontSize(12);
      pdf.setTextColor(102, 102, 102);
      pdf.text("Your feedback helps us serve you better!", 20, 82);

      // Add QR code with white background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(20, 90, 80, 80, 'F');
      pdf.addImage(qrCodeDataUrl, "PNG", 20, 90, 80, 80);

      // Add URL below QR code
      pdf.setFontSize(10);
      pdf.setTextColor(233, 78, 135); // EatUp pink
      pdf.text(fullUrl, 20, 180);

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text("Powered by EatUp - The smart way to collect customer feedback", 20, 290);

      // Save the PDF
      pdf.save(`${restaurantName || 'restaurant'}-review-qr-code.pdf`);

      toast({
        title: "PDF Created!",
        description: "Your branded QR code PDF has been generated.",
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