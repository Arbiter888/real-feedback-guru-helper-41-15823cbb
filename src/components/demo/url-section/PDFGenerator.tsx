import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import { generateSinglePage } from "./pdf/SinglePageGenerator";
import { generateTableCards } from "./pdf/TableCardsGenerator";

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
      // Create new PDF
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      // Generate first page with single QR code
      await generateSinglePage({
        doc,
        url,
        qrCodeUrl,
        restaurantName,
        reviewRewardAmount,
        tipRewardPercentage,
      });

      // Generate second page with table cards
      await generateTableCards({
        doc,
        qrCodeUrl,
        reviewRewardAmount,
        tipRewardPercentage,
      });
      
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