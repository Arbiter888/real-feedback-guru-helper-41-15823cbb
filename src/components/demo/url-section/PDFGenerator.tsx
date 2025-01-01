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

      const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
      const { reviewRewardAmount = 10, tipRewardPercentage = 50 } = savedRestaurantInfo 
        ? JSON.parse(savedRestaurantInfo) 
        : {};

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add EatUP! logo
      const logoUrl = '/lovable-uploads/7d4606be-1c43-44b0-83f0-eb98a468334a.png';
      pdf.addImage(logoUrl, 'PNG', 20, 20, 90, 30);

      // Add decorative header bar
      pdf.setFillColor(EATUP_PINK);
      pdf.rect(0, 70, 210, 2, 'F');

      // Restaurant name and program title
      pdf.setTextColor(EATUP_DARK);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${restaurantName}'s EatUP! Rewards`, 20, 90);

      // Subtitle with reward amounts
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Get up to £${reviewRewardAmount} for reviews and ${tipRewardPercentage}% back on tips!`, 20, 100);

      // QR Code section
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(EATUP_PINK);
      pdf.roundedRect(20, 110, 90, 90, 3, 3, 'FD');
      pdf.addImage(qrCodeUrl, "PNG", 25, 115, 80, 80);

      // Rewards section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Rewards:", 120, 120);

      // Reward details
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      const rewardDetails = [
        `• Get £${reviewRewardAmount} credit for your review`,
        `• Receive ${tipRewardPercentage}% of your tip back`,
        "• Instant digital rewards",
        "• Valid for 30 days"
      ];

      rewardDetails.forEach((detail, index) => {
        pdf.text(detail, 120, 135 + (index * 10));
      });

      // How it works section
      pdf.setFont("helvetica", "bold");
      pdf.text("How it works:", 20, 220);

      pdf.setFont("helvetica", "normal");
      const steps = [
        "1. Scan the QR code",
        "2. Share your dining experience",
        "3. Add your receipt photo",
        "4. Get instant rewards"
      ];

      steps.forEach((step, index) => {
        pdf.text(step, 20, 235 + (index * 10));
      });

      // URL at the bottom
      pdf.setFontSize(10);
      pdf.setTextColor(EATUP_PINK);
      pdf.text(url, 20, 270);

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text("Powered by EatUP! - The smart way to earn rewards", 20, 280);

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