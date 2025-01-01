import jsPDF from "jspdf";
import { loadImage } from "@/utils/pdfUtils";

interface TableCardsGeneratorProps {
  doc: jsPDF;
  qrCodeUrl: string;
  reviewRewardAmount: number;
  tipRewardPercentage: number;
}

export const generateTableCards = async ({
  doc,
  qrCodeUrl,
  reviewRewardAmount,
  tipRewardPercentage,
}: TableCardsGeneratorProps) => {
  // Set up page for table cards (A4 landscape)
  doc.addPage([297, 210]); // A4 dimensions in mm, landscape
  doc.setFillColor(255, 255, 255);

  // Card dimensions (in mm) - adjusted for better proportions
  const cardWidth = 135;
  const cardHeight = 95;
  const margin = 8;
  const startX = 12;
  const startY = 10;

  // Load images with error handling
  try {
    const [logoImg, qrImg] = await Promise.all([
      loadImage("/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png"),
      loadImage(qrCodeUrl),
    ]);

    // Create 2x2 grid of cards
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = startX + (cardWidth + margin) * col;
        const y = startY + (cardHeight + margin) * row;

        // Draw card border (solid, thin line)
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.rect(x, y, cardWidth, cardHeight);

        // Draw corner marks for cutting
        const markLength = 3;
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.2);
        
        // Top-left corner
        doc.line(x - markLength, y, x + markLength, y);
        doc.line(x, y - markLength, x, y + markLength);
        
        // Top-right corner
        doc.line(x + cardWidth - markLength, y, x + cardWidth + markLength, y);
        doc.line(x + cardWidth, y - markLength, x + cardWidth, y + markLength);
        
        // Bottom-left corner
        doc.line(x - markLength, y + cardHeight, x + markLength, y + cardHeight);
        doc.line(x, y + cardHeight - markLength, x, y + cardHeight + markLength);
        
        // Bottom-right corner
        doc.line(x + cardWidth - markLength, y + cardHeight, x + cardWidth + markLength, y + cardHeight);
        doc.line(x + cardWidth, y + cardHeight - markLength, x + cardWidth, y + cardHeight + markLength);

        // Draw dotted cut lines
        doc.setLineDashPattern([0.5, 0.5], 0);
        doc.setDrawColor(180, 180, 180);
        
        // Horizontal dotted lines
        doc.line(x + markLength, y, x + cardWidth - markLength, y);
        doc.line(x + markLength, y + cardHeight, x + cardWidth - markLength, y + cardHeight);
        
        // Vertical dotted lines
        doc.line(x, y + markLength, x, y + cardHeight - markLength);
        doc.line(x + cardWidth, y + markLength, x + cardWidth, y + cardHeight - markLength);

        // Draw fold line (more visible)
        doc.setLineDashPattern([1, 1], 0);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.3);
        doc.line(x, y + cardHeight * 0.75, x + cardWidth, y + cardHeight * 0.75);

        // Add logo (increased size)
        doc.addImage(logoImg, "PNG", x + 32.5, y + 5, 70, 25);

        // Add QR code (increased size)
        doc.addImage(qrImg, "PNG", x + 27.5, y + 32, 80, 80);

        // Add text with improved hierarchy
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(34, 31, 38);
        
        // Center-align all text
        const rewardTitle = "Get Rewarded for";
        const rewardSubtitle = "Tips & Reviews";
        const rewardAmount = `Get ${reviewRewardAmount}% off now`;
        const tipCredit = `+ ${tipRewardPercentage}% tip credit`;
        
        const titleWidth = doc.getTextWidth(rewardTitle);
        const subtitleWidth = doc.getTextWidth(rewardSubtitle);
        const rewardWidth = doc.getTextWidth(rewardAmount);
        const tipWidth = doc.getTextWidth(tipCredit);
        
        // Position text with better spacing
        doc.text(rewardTitle, x + (cardWidth - titleWidth) / 2, y + cardHeight - 25);
        doc.text(rewardSubtitle, x + (cardWidth - subtitleWidth) / 2, y + cardHeight - 20);
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(rewardAmount, x + (cardWidth - rewardWidth) / 2, y + cardHeight - 13);
        doc.text(tipCredit, x + (cardWidth - tipWidth) / 2, y + cardHeight - 7);
      }
    }

    // Add instructions at bottom
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Cut along the dotted lines and fold at the horizontal line to create standing table cards", startX, 190);

  } catch (error) {
    console.error('Error generating table cards:', error);
    throw error;
  }
};