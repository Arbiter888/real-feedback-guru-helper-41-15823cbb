import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

interface PDFGeneratorProps {
  url: string;
  qrCodeUrl: string | null;
  restaurantName: string;
}

export const PDFGenerator = ({ url, qrCodeUrl, restaurantName }: PDFGeneratorProps) => {
  const { toast } = useToast();
  const EATUP_PINK = '#E94E87';
  const EATUP_DARK = '#221F26';

  const generateQRCode = async (url: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(url, {
        width: 1000,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const downloadPDF = async () => {
    try {
      // Generate QR code if not already generated
      const qrDataUrl = qrCodeUrl || await generateQRCode(url);

      // Create PDF with A4 dimensions (in mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add EatUP! logo with proper dimensions
      const logoUrl = '/lovable-uploads/5abedc45-81c6-4729-ac6a-e5cf72b9bbab.png';
      pdf.addImage(logoUrl, 'PNG', 20, 20, 60, 30); // Adjusted dimensions for better aspect ratio

      // Add decorative header bar
      pdf.setFillColor(EATUP_PINK);
      pdf.rect(0, 60, 210, 2, 'F');

      // Restaurant name
      pdf.setTextColor(EATUP_DARK);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(restaurantName, 20, 80);

      // Subtitle with proper spacing
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text("Share Your Experience & Join Our Rewards Program", 20, 90);

      // QR Code section with white background and border
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(EATUP_PINK);
      pdf.roundedRect(20, 100, 90, 90, 3, 3, 'FD');
      pdf.addImage(qrDataUrl, "PNG", 25, 105, 80, 80);

      // How it works section with proper formatting
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("How it works:", 120, 110);

      // Steps with consistent formatting and spacing
      const steps = [
        "📱 Scan the QR code",
        "⭐ Share your experience",
        "🧾 Add your receipt photo",
        "💌 Join our rewards program"
      ];

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      steps.forEach((step, index) => {
        pdf.text(step, 120, 130 + (index * 10));
      });

      // Your EatUP! Journey section
      pdf.setFillColor(248, 250, 252);
      pdf.rect(20, 200, 170, 50, 'F');
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Today's Visit", 30, 215);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const journeyText = [
        "• Share your dining experience",
        "• Receive a thank you email with a special voucher for your next visit",
        "• Get exclusive weekly offers and rewards"
      ];

      journeyText.forEach((text, index) => {
        pdf.text(text, 30, 230 + (index * 7));
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
        description: "Failed to generate PDF. Please try again.",
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