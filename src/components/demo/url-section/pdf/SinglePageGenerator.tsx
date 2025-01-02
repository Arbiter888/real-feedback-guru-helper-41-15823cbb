import jsPDF from "jspdf";
import { loadImage } from "@/utils/pdfUtils";

interface SinglePageGeneratorProps {
  doc: jsPDF;
  qrCodeUrl: string;
  url: string;
  restaurantName: string;
  reviewRewardAmount: number;
  tipRewardPercentage: number;
}

export const generateSinglePage = async ({
  doc,
  qrCodeUrl,
  restaurantName,
  reviewRewardAmount,
  tipRewardPercentage,
}: SinglePageGeneratorProps) => {
  try {
    // Load images
    const [logoImg, qrImg] = await Promise.all([
      loadImage("/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png"),
      loadImage(qrCodeUrl),
    ]);

    // Set up page (A4)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, "F");

    // Add logo at top
    const logoWidth = 120;
    const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
    doc.addImage(logoImg, "PNG", (210 - logoWidth) / 2, 20, logoWidth, logoHeight);

    // Add restaurant name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(34, 31, 38);
    doc.text(`${restaurantName} Rewards`, 105, logoHeight + 50, { align: "center" });

    // Add QR code with pink border
    const qrSize = 100;
    const qrX = (210 - qrSize) / 2;
    const qrY = logoHeight + 70;
    
    // Add pink border around QR code
    doc.setDrawColor(233, 78, 135);
    doc.setLineWidth(0.5);
    doc.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);
    
    // Add QR code
    doc.addImage(qrImg, "PNG", qrX, qrY, qrSize, qrSize);

    // Add "How it works" section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("How it works:", 20, logoHeight + qrSize + 90);

    // Add steps
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const steps = [
      "Scan the QR code with your phone",
      "Share your dining experience",
      `Get ${reviewRewardAmount}% off now + ${tipRewardPercentage}% tip credit`,
    ];

    steps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step}`, 25, logoHeight + qrSize + 110 + (index * 10));
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Visit eatup.co for more information", 105, 270, { align: "center" });
    doc.text("Powered by EatUP! Rewards", 105, 280, { align: "center" });

  } catch (error) {
    console.error('Error generating single page:', error);
    throw error;
  }
};