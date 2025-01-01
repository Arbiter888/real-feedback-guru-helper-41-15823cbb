import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";

interface PDFGeneratorProps {
  url: string;
  qrCodeUrl: string | null;
  restaurantName: string;
  reviewRewardAmount?: number;
  tipRewardPercentage?: number;
}

export const PDFGenerator = ({ 
  url, 
  qrCodeUrl, 
  restaurantName,
  reviewRewardAmount = 10,
  tipRewardPercentage = 50
}: PDFGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!qrCodeUrl) return;
    
    setIsGenerating(true);
    try {
      // Create new PDF with slightly larger dimensions for better layout
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      // Add EatUP! logo and tagline
      doc.setFillColor(233, 78, 135); // #E94E87
      doc.rect(20, 15, 15, 15, "F");
      doc.setTextColor(34, 31, 38); // #221F26
      doc.setFontSize(32);
      doc.text("EatUP!", 40, 27);
      doc.setFontSize(14);
      doc.text("EAT. EARN. SAVE.", 40, 35);
      
      // Add horizontal line
      doc.setDrawColor(233, 78, 135);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // Add title and subtitle
      doc.setFontSize(24);
      doc.text(`${restaurantName} EatUP! Rewards`, 20, 65);
      doc.setFontSize(16);
      doc.text("Get rewarded twice with every visit!", 20, 75);
      
      // Add QR code
      const img = new Image();
      img.src = qrCodeUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      // Add QR code with pink border
      doc.setDrawColor(233, 78, 135);
      doc.setLineWidth(0.5);
      doc.roundedRect(20, 85, 70, 70, 3, 3);
      doc.addImage(img, "PNG", 22, 87, 66, 66);
      
      // Add "How it works" section
      doc.setFontSize(18);
      doc.text("How it works:", 100, 95);
      
      doc.setFontSize(14);
      const steps = [
        "1. Scan the QR code",
        "2. Share your dining experience",
        "3. Add your receipt photo",
        "4. Get instant rewards for both tips & reviews"
      ];
      steps.forEach((step, index) => {
        doc.text(step, 100, 105 + (index * 10));
      });
      
      // Add "Your EatUP! Journey" section
      doc.setFontSize(18);
      doc.text("Your EatUP! Journey", 20, 180);
      
      doc.setFontSize(14);
      const rewards = [
        `• Get ${reviewRewardAmount}% off your current bill when you review`,
        `• Earn ${tipRewardPercentage}% of your tip as future credit`,
        "• Get exclusive weekly offers in your inbox"
      ];
      rewards.forEach((reward, index) => {
        doc.text(reward, 20, 190 + (index * 10));
      });
      
      // Add URL at bottom
      doc.setFontSize(10);
      doc.setTextColor(233, 78, 135);
      doc.text(url, 20, 270);
      
      // Add powered by text
      doc.setTextColor(128, 128, 128);
      doc.text("Powered by EatUP! - The smart way to earn rewards", 20, 280);
      
      // Save the PDF
      doc.save(`${restaurantName.toLowerCase().replace(/\s+/g, '-')}-eatup-rewards.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      disabled={!qrCodeUrl || isGenerating}
    >
      <FileDown className="h-4 w-4 mr-2" />
      {isGenerating ? "Generating PDF..." : "Download PDF"}
    </Button>
  );
};