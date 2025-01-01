import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { generateSinglePage } from "./pdf/SinglePageGenerator";
import { generateTableCards } from "./pdf/TableCardsGenerator";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const generatePDF = async () => {
    if (!qrCodeUrl) {
      toast({
        title: "Error",
        description: "Please generate a QR code first",
        variant: "destructive",
      });
      return;
    }
    
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
      
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
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
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4 mr-2" />
          Download PDF
        </>
      )}
    </Button>
  );
};