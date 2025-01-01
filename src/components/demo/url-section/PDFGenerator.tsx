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

  const generateTableCards = async (doc: jsPDF) => {
    if (!qrCodeUrl) return;

    // Set up page for table cards (A4 landscape)
    doc.addPage([297, 210]); // A4 dimensions in mm, landscape
    doc.setFillColor(255, 255, 255);

    // Card dimensions (in mm)
    const cardWidth = 125;
    const cardHeight = 90;
    const margin = 10;
    const startX = 15;
    const startY = 15;

    // Load EatUP! logo
    const logoImg = new Image();
    logoImg.src = "/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png";
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });

    // Load QR code
    const qrImg = new Image();
    qrImg.src = qrCodeUrl;
    await new Promise((resolve) => {
      qrImg.onload = resolve;
    });

    // Create 2x2 grid of cards
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = startX + (cardWidth + margin) * col;
        const y = startY + (cardHeight + margin) * row;

        // Draw card border (solid)
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.rect(x, y, cardWidth, cardHeight);

        // Draw cut lines
        doc.setDrawColor(150, 150, 150);
        doc.setLineDashPattern([1, 1], 0);
        // Horizontal cut lines
        doc.line(x - 5, y, x, y);
        doc.line(x + cardWidth, y, x + cardWidth + 5, y);
        doc.line(x - 5, y + cardHeight, x, y + cardHeight);
        doc.line(x + cardWidth, y + cardHeight, x + cardWidth + 5, y + cardHeight);
        // Vertical cut lines
        doc.line(x, y - 5, x, y);
        doc.line(x, y + cardHeight, x, y + cardHeight + 5);
        doc.line(x + cardWidth, y - 5, x + cardWidth, y);
        doc.line(x + cardWidth, y + cardHeight, x + cardWidth, y + cardHeight + 5);

        // Draw fold lines (dotted)
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.line(x, y + cardHeight * 0.75, x + cardWidth, y + cardHeight * 0.75);

        // Add logo
        doc.addImage(logoImg, "PNG", x + 42.5, y + 5, 40, 15);

        // Add QR code
        doc.addImage(qrImg, "PNG", x + 37.5, y + 25, 50, 50);

        // Add text
        doc.setFontSize(10);
        doc.setTextColor(34, 31, 38);
        const rewardText = `Get ${reviewRewardAmount}% off now`;
        const tipText = `+ ${tipRewardPercentage}% tip credit`;
        const textWidth = doc.getTextWidth(rewardText);
        doc.text(rewardText, x + (cardWidth - textWidth) / 2, y + 82);
        const tipTextWidth = doc.getTextWidth(tipText);
        doc.text(tipText, x + (cardWidth - tipTextWidth) / 2, y + 87);
      }
    }

    // Add instructions at bottom
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Cut along the dotted lines and fold at the horizontal line to create standing table cards", startX, 190);
  };

  const generatePDF = async () => {
    if (!qrCodeUrl) return;
    
    setIsGenerating(true);
    try {
      // Create new PDF
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      // First page - Single QR display
      // Add EatUP! logo
      const logoImg = new Image();
      logoImg.src = "/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png";
      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });
      doc.addImage(logoImg, "PNG", 20, 15, 40, 15);
      
      // Add tagline
      doc.setTextColor(34, 31, 38);
      doc.setFontSize(14);
      doc.text("EAT. EARN. SAVE.", 20, 40);
      
      // Add horizontal line
      doc.setDrawColor(233, 78, 135);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // Add title and subtitle
      doc.setFontSize(24);
      doc.text(`${restaurantName} EatUP! Rewards`, 20, 65);
      doc.setFontSize(16);
      doc.text("Get rewarded twice with every visit!", 20, 75);
      
      // Add QR code with pink border
      const img = new Image();
      img.src = qrCodeUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
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
      
      // Add rewards section
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

      // Generate table cards page
      await generateTableCards(doc);
      
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