import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface PDFGeneratorProps {
  url: string;
  qrCodeUrl: string | null;
  restaurantName: string;
}

export const PDFGenerator = ({ url, qrCodeUrl, restaurantName }: PDFGeneratorProps) => {
  const { toast } = useToast();

  const downloadPDF = async () => {
    try {
      if (!qrCodeUrl) {
        toast({
          title: "Generate QR Code First",
          description: "Please generate the QR code before downloading the PDF.",
          variant: "destructive",
        });
        return;
      }

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
      pdf.text(restaurantName, 20, 60);

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
      pdf.addImage(qrCodeUrl, "PNG", 20, 90, 80, 80);

      // Add URL below QR code
      pdf.setFontSize(10);
      pdf.setTextColor(233, 78, 135); // EatUp pink
      pdf.text(url, 20, 180);

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text("Powered by EatUp - The smart way to collect customer feedback", 20, 290);

      // Save the PDF
      pdf.save(`${restaurantName}-review-qr-code.pdf`);

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

  return (
    <Button
      onClick={downloadPDF}
      variant="outline"
      className="flex-shrink-0"
    >
      <Download className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  );
};