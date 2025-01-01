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
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(24);
      doc.setTextColor(233, 78, 135); // #E94E87
      doc.text("Share Your Experience & Get Rewarded!", 105, 20, { align: "center" });
      
      // Add restaurant name
      doc.setFontSize(18);
      doc.setTextColor(51, 51, 51);
      doc.text(restaurantName, 105, 35, { align: "center" });

      // Add rewards information
      doc.setFontSize(16);
      doc.setTextColor(233, 78, 135);
      doc.text("Triple Rewards Await You:", 105, 50, { align: "center" });
      
      // Add reward details
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text([
        `1. Get ${reviewRewardAmount}% off your current bill`,
        `2. Receive ${tipRewardPercentage}% of your tip as future credit`,
        "3. Exclusive personalized voucher when you join"
      ], 105, 65, { align: "center" });

      // Add QR code
      const img = new Image();
      img.src = qrCodeUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      doc.addImage(img, "PNG", 65, 95, 80, 80);
      
      // Add instructions
      doc.setFontSize(12);
      doc.setTextColor(102, 102, 102);
      doc.text([
        "1. Scan the QR code",
        "2. Share your dining experience",
        "3. Join our rewards program",
        "4. Get instantly rewarded!"
      ], 105, 190, { align: "center" });
      
      // Add URL as text
      doc.setFontSize(10);
      doc.text(url, 105, 210, { align: "center" });
      
      // Save the PDF
      doc.save(`${restaurantName.toLowerCase().replace(/\s+/g, '-')}-rewards-qr.pdf`);
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