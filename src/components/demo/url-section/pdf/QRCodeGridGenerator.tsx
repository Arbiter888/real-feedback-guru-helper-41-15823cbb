import jsPDF from "jspdf";
import { loadImage } from "@/utils/pdfUtils";

interface QRCodeGridGeneratorProps {
  doc: jsPDF;
  qrCodeUrl: string;
  reviewRewardAmount: number;
  tipRewardPercentage: number;
}

export const generateQRCodeGrid = async ({
  doc,
  qrCodeUrl,
  reviewRewardAmount,
  tipRewardPercentage,
}: QRCodeGridGeneratorProps) => {
  // Add new page in landscape orientation
  doc.addPage([297, 210]);
  
  // Set white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 297, 210, "F");

  // Grid configuration
  const cols = 2;
  const rows = 2;
  const qrSize = 80;
  const padding = 20;
  const startX = (297 - (cols * qrSize + (cols - 1) * padding)) / 2;
  const startY = (210 - (rows * qrSize + (rows - 1) * padding)) / 2;

  // Load QR code image
  const qrImg = await loadImage(qrCodeUrl);

  // Generate grid of QR codes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (qrSize + padding);
      const y = startY + row * (qrSize + padding);

      // Draw white background and border
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, qrSize, qrSize, "F");
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.rect(x, y, qrSize, qrSize);

      // Add QR code
      doc.addImage(qrImg, "PNG", x + 2.5, y + 2.5, qrSize - 5, qrSize - 5);

      // Add cut marks
      const markLength = 5;
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.2);

      // Corner marks
      doc.line(x - markLength, y, x + markLength, y);
      doc.line(x, y - markLength, x, y + markLength);
      doc.line(x + qrSize - markLength, y, x + qrSize + markLength, y);
      doc.line(x + qrSize, y - markLength, x + qrSize, y + markLength);
      doc.line(x - markLength, y + qrSize, x + markLength, y + qrSize);
      doc.line(x, y + qrSize - markLength, x, y + qrSize + markLength);
      doc.line(x + qrSize - markLength, y + qrSize, x + qrSize + markLength, y + qrSize);
      doc.line(x + qrSize, y + qrSize - markLength, x + qrSize, y + qrSize + markLength);
    }
  }

  // Add instructions at bottom
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text("Cut along the marks to create individual QR codes", 148.5, 190, { align: "center" });
};