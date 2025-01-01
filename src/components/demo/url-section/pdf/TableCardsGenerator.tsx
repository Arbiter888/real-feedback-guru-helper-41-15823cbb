import jsPDF from "jspdf";
import { loadImage, drawCutLines, drawFoldLine } from "@/utils/pdfUtils";

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

  // Card dimensions (in mm)
  const cardWidth = 125;
  const cardHeight = 90;
  const margin = 10;
  const startX = 15;
  const startY = 15;

  // Load images
  const [logoImg, qrImg] = await Promise.all([
    loadImage("/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png"),
    loadImage(qrCodeUrl),
  ]);

  // Create 2x2 grid of cards
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const x = startX + (cardWidth + margin) * col;
      const y = startY + (cardHeight + margin) * row;

      // Draw card border (solid)
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(x, y, cardWidth, cardHeight);

      // Draw cut and fold lines
      drawCutLines(doc, x, y, cardWidth, cardHeight);
      drawFoldLine(doc, x, y, cardWidth, cardHeight);

      // Add logo (increased size)
      doc.addImage(logoImg, "PNG", x + 32.5, y + 5, 60, 22);

      // Add QR code (increased size)
      doc.addImage(qrImg, "PNG", x + 32.5, y + 25, 60, 60);

      // Add text
      doc.setFontSize(11);
      doc.setTextColor(34, 31, 38);
      
      // Center-align text
      const rewardText = `Get ${reviewRewardAmount}% off now`;
      const tipText = `+ ${tipRewardPercentage}% tip credit`;
      const textWidth = doc.getTextWidth(rewardText);
      const tipTextWidth = doc.getTextWidth(tipText);
      
      doc.text(rewardText, x + (cardWidth - textWidth) / 2, y + 82);
      doc.text(tipText, x + (cardWidth - tipTextWidth) / 2, y + 87);
    }
  }

  // Add instructions at bottom
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text("Cut along the dotted lines and fold at the horizontal line to create standing table cards", startX, 190);
};