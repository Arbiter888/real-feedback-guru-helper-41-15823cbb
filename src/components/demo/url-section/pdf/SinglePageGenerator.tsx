import jsPDF from "jspdf";
import { loadImage } from "@/utils/pdfUtils";

interface SinglePageGeneratorProps {
  doc: jsPDF;
  qrCodeUrl: string;
  url: string; // Added missing url property
  restaurantName: string;
  reviewRewardAmount: number;
  tipRewardPercentage: number;
}

export const generateSinglePage = async ({
  doc,
  qrCodeUrl,
  url,
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

    // Add tagline
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(233, 78, 135);
    doc.text("EAT. EARN. SAVE.", 105, logoHeight + 35, { align: "center" });

    // Add restaurant name
    doc.setFontSize(24);
    doc.setTextColor(34, 31, 38);
    doc.text(`The ${restaurantName} EatUP! Rewards`, 105, logoHeight + 60, { align: "center" });

    // Add QR code
    const qrSize = 100;
    doc.addImage(qrImg, "PNG", (210 - qrSize) / 2, logoHeight + 80, qrSize, qrSize);

    // Add "How it works" section
    doc.setFontSize(18);
    doc.text("How it works:", 20, logoHeight + qrSize + 100);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const steps = [
      "Scan the QR code with your phone",
      "Share your dining experience",
      "Get instant rewards and future savings",
    ];

    steps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step}`, 25, logoHeight + qrSize + 120 + (index * 10));
    });

    // Add "Your EatUP! Journey" section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Your EatUP! Journey", 20, logoHeight + qrSize + 160);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const benefits = [
      `Get ${reviewRewardAmount}% off your current bill when you share your experience`,
      `Earn ${tipRewardPercentage}% of your tip back as credit for your next visit`,
      "Receive exclusive offers and rewards",
      "Join our community of food lovers",
    ];

    benefits.forEach((benefit, index) => {
      doc.text(`• ${benefit}`, 25, logoHeight + qrSize + 180 + (index * 10));
    });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Visit eatup.com for more information", 105, 270, { align: "center" });
    doc.text("Powered by EatUP! Rewards", 105, 280, { align: "center" });

  } catch (error) {
    console.error('Error generating single page:', error);
    throw error;
  }
};