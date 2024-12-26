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

      // Create PDF with A4 dimensions (in mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add gradient background
      pdf.setFillColor(155, 135, 245); // Primary Purple
      pdf.rect(0, 0, 210, 40, 'F');
      pdf.setFillColor(217, 70, 239); // Magenta Pink
      pdf.rect(0, 40, 210, 10, 'F');

      // Add "EatUP!" text in header
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.text("EatUP!", 20, 25);

      // Add tagline
      pdf.setFontSize(16);
      pdf.text("Collect Reviews. Reward Customers.", 20, 35);

      // Main heading with restaurant name
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Review ${restaurantName}`, 20, 70);
      pdf.text("and get Rewarded!", 20, 80);

      // Instructions section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Simply follow these steps:", 20, 100);
      
      // Steps with consistent spacing
      const steps = [
        "1. Scan the QR code below",
        "2. Share some positive words",
        "3. Add a photo of your receipt",
        "4. Share your review on Google",
        "5. Sign up to get your tailored voucher for your next visit"
      ];

      steps.forEach((step, index) => {
        pdf.text(step, 25, 115 + (index * 10));
      });

      // Add QR code with white background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(20, 170, 80, 80, 'F');
      pdf.addImage(qrCodeUrl, "PNG", 20, 170, 80, 80);

      // Add URL below QR code
      pdf.setFontSize(10);
      pdf.setTextColor(217, 70, 239); // Magenta Pink
      pdf.text(url, 20, 260);

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text("Powered by EatUP - The smart way to collect customer feedback", 20, 285);

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