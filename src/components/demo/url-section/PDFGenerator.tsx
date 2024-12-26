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
  const EATUP_PINK = '#E94E87';
  const EATUP_DARK = '#221F26';

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

      // Add EatUP! logo
      const logoUrl = '/lovable-uploads/7d4606be-1c43-44b0-83f0-eb98a468334a.png';
      pdf.addImage(logoUrl, 'PNG', 20, 20, 60, 20);

      // Add decorative header bar
      pdf.setFillColor(EATUP_PINK);
      pdf.rect(0, 50, 210, 2, 'F');

      // Restaurant name
      pdf.setTextColor(EATUP_DARK);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(restaurantName, 20, 70);

      // Subtitle
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text("Share Your Experience & Join Our Rewards Program", 20, 80);

      // QR Code section with white background and border
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(EATUP_PINK);
      pdf.roundedRect(20, 90, 90, 90, 3, 3, 'FD');
      pdf.addImage(qrCodeUrl, "PNG", 25, 95, 80, 80);

      // Instructions section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("How it works:", 120, 100);

      // Steps with icons
      const steps = [
        "📱 Scan the QR code",
        "⭐ Share your experience",
        "🧾 Add your receipt photo",
        "💌 Join our rewards program"
      ];

      steps.forEach((step, index) => {
        pdf.setFont("helvetica", "normal");
        pdf.text(step, 120, 120 + (index * 10));
      });

      // Your EatUP! Journey section
      pdf.setFillColor(248, 250, 252); // Light gray background
      pdf.rect(20, 190, 170, 50, 'F');
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Your EatUP! Journey", 30, 205);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      const journeyText = [
        "• Share your dining experience today",
        "• Receive a personalized thank you email with a special voucher",
        "• Get exclusive weekly offers and rewards"
      ];

      journeyText.forEach((text, index) => {
        pdf.text(text, 30, 220 + (index * 8));
      });

      // URL at the bottom
      pdf.setFontSize(10);
      pdf.setTextColor(EATUP_PINK);
      pdf.text(url, 20, 270);

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text("Powered by EatUP! - The smart way to earn rewards", 20, 280);

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