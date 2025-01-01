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
      doc.text("Scan & Share Your Experience!", 105, 20, { align: "center" });
      
      // Add restaurant name
      doc.setFontSize(18);
      doc.setTextColor(51, 51, 51);
      doc.text(restaurantName, 105, 35, { align: "center" });

      // Add rewards information
      doc.setFontSize(16);
      doc.setTextColor(233, 78, 135);
      doc.text("Your Rewards:", 105, 50, { align: "center" });
      
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text(`£${reviewRewardAmount} for sharing your review`, 105, 60, { align: "center" });
      doc.text(`${tipRewardPercentage}% of your tip back as credit`, 105, 70, { align: "center" });

      // Add QR code
      const img = new Image();
      img.src = qrCodeUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      doc.addImage(img, "PNG", 65, 85, 80, 80);
      
      // Add instructions
      doc.setFontSize(12);
      doc.setTextColor(102, 102, 102);
      doc.text([
        "1. Scan the QR code",
        "2. Share your experience",
        "3. Get rewarded instantly!"
      ], 105, 180, { align: "center" });
      
      // Add URL as text
      doc.setFontSize(10);
      doc.text(url, 105, 200, { align: "center" });
      
      // Save the PDF
      doc.save(`${restaurantName.toLowerCase().replace(/\s+/g, '-')}-review-qr.pdf`);
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