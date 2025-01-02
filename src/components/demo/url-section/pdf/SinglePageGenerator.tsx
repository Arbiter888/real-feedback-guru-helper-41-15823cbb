import jsPDF from "jspdf";
import { loadImage } from "@/utils/pdfUtils";

interface SinglePageGeneratorProps {
  doc: jsPDF;
  url: string;
  qrCodeUrl: string;
  restaurantName: string;
  reviewRewardAmount: number;
  tipRewardPercentage: number;
}

export const generateSinglePage = async ({
  doc,
  url,
  qrCodeUrl,
  restaurantName,
  reviewRewardAmount,
  tipRewardPercentage,
}: SinglePageGeneratorProps) => {
  // Set white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  // Add EatUP! logo with increased size
  const logoImg = await loadImage("/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png");
  doc.addImage(logoImg, "PNG", 75, 20, 60, 22);
  
  // Add tagline
  doc.setTextColor(34, 31, 38);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(`The ${restaurantName}`, 105, 60, { align: "center" });
  doc.text("EatUP! Rewards", 105, 75, { align: "center" });
  
  // Add horizontal line
  doc.setDrawColor(233, 78, 135);
  doc.setLineWidth(0.5);
  doc.line(40, 85, 170, 85);
  
  // Add QR code with white background and border
  const qrImg = await loadImage(qrCodeUrl);
  doc.setFillColor(255, 255, 255);
  doc.rect(55, 95, 100, 100, "F");
  doc.setDrawColor(233, 78, 135);
  doc.setLineWidth(0.5);
  doc.rect(55, 95, 100, 100);
  doc.addImage(qrImg, "PNG", 57.5, 97.5, 95, 95);
  
  // Add "How it works:" section
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("How it works:", 30, 215);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const steps = [
    `1. Get ${reviewRewardAmount}% off your current bill when you share your experience`,
    `2. Earn ${tipRewardPercentage}% of your tip back as credit for your next visit`,
    "3. Share with friends to earn more rewards"
  ];
  
  steps.forEach((step, index) => {
    doc.text(step, 35, 230 + (index * 10));
  });
  
  // Add "Your EatUP! Journey" section
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Your EatUP! Journey:", 30, 270);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const journey = [
    "• Scan the QR code",
    "• Share your dining experience",
    "• Get instant rewards",
    "• Earn more by referring friends"
  ];
  
  journey.forEach((item, index) => {
    doc.text(item, 35, 285 + (index * 10));
  });
  
  // Add URL and powered by text at bottom
  doc.setFontSize(10);
  doc.setTextColor(233, 78, 135);
  doc.text(url, 105, 270, { align: "center" });
  
  doc.setTextColor(128, 128, 128);
  doc.text("Powered by EatUP! - The smart way to earn rewards", 105, 280, { align: "center" });
};