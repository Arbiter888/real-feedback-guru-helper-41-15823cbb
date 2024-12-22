import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface ReviewPageUrlSectionProps {
  restaurantName: string | null;
  googleMapsUrl: string | null;
  generatedUrl: string | null;
}

export const ReviewPageUrlSection = ({ restaurantName, generatedUrl }: ReviewPageUrlSectionProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (generatedUrl) {
      const fullUrl = `${window.location.origin}${generatedUrl}`;
      QRCode.toDataURL(fullUrl)
        .then(url => {
          setQrCodeUrl(url);
        })
        .catch(err => {
          console.error('Error generating QR code:', err);
        });
    }
  }, [generatedUrl]);

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'review-page-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (!qrCodeUrl || !restaurantName) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up the PDF content
    pdf.setFontSize(24);
    pdf.setTextColor(233, 78, 135); // Primary pink color
    const title = `Leave a review for ${restaurantName}`;
    const titleWidth = pdf.getTextWidth(title);
    const pageWidth = pdf.internal.pageSize.width;
    const titleX = (pageWidth - titleWidth) / 2;
    pdf.text(title, titleX, 30);

    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    const subtitle = "and get rewarded!";
    const subtitleWidth = pdf.getTextWidth(subtitle);
    const subtitleX = (pageWidth - subtitleWidth) / 2;
    pdf.text(subtitle, subtitleX, 40);

    // Add QR code
    const img = new Image();
    img.src = qrCodeUrl;
    
    img.onload = () => {
      const qrSize = 100;
      const qrX = (pageWidth - qrSize) / 2;
      pdf.addImage(img, 'PNG', qrX, 60, qrSize, qrSize);

      // Add instructions
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const instructions = "Scan the QR code with your phone's camera to leave a review";
      const instructionsWidth = pdf.getTextWidth(instructions);
      const instructionsX = (pageWidth - instructionsWidth) / 2;
      pdf.text(instructions, instructionsX, 180);

      // Save the PDF
      pdf.save(`${restaurantName.toLowerCase().replace(/\s+/g, '-')}-review-qr.pdf`);
    };
  };

  const handleCopyUrl = async () => {
    const fullUrl = `${window.location.origin}${generatedUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({
        title: "URL copied!",
        description: "The URL has been copied to your clipboard.",
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

  const fullUrl = `${window.location.origin}${generatedUrl}`;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Your unique URL to share with customers:</p>
        <div className="flex flex-col space-y-2">
          <div className="relative group">
            <code className="block p-4 bg-gray-50 rounded-lg text-sm break-all font-mono text-primary pr-12">
              {fullUrl}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleCopyUrl}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {qrCodeUrl && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Your unique QR code to share with customers:</p>
          <div className="bg-white p-4 rounded-lg inline-block">
            <img 
              src={qrCodeUrl} 
              alt="QR Code for review page" 
              className="w-32 h-32"
            />
            <div className="flex flex-col gap-2 mt-3">
              <Button 
                onClick={handleDownloadQR}
                variant="outline"
                className="w-full text-sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                variant="outline"
                className="w-full text-sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF with QR Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};