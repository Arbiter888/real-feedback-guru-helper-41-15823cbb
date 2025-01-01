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
  // Add EatUP! logo
  const logoImg = await loadImage("/lovable-uploads/f30e50d5-6430-450d-9e41-5b7b45e8ef7c.png");
  doc.addImage(logoImg, "PNG", 20, 15, 60, 22); // Increased size from 40x15 to 60x22
  
  // Add tagline
  doc.setTextColor(34, 31, 38);
  doc.setFontSize(14);
  doc.text("EAT. EARN. SAVE.", 20, 45);
  
  // Add horizontal line
  doc.setDrawColor(233, 78, 135);
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);
  
  // Add title and subtitle
  doc.setFontSize(24);
  doc.text(`${restaurantName} EatUP! Rewards`, 20, 70);
  doc.setFontSize(16);
  doc.text("Get rewarded twice with every visit!", 20, 80);
  
  // Add QR code with pink border
  const qrImg = await loadImage(qrCodeUrl);
  doc.setDrawColor(233, 78, 135);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, 90, 80, 80, 3, 3); // Increased size from 70x70 to 80x80
  doc.addImage(qrImg, "PNG", 22, 92, 76, 76); // Adjusted to fit new container size
  
  // Add "How it works" section
  doc.setFontSize(18);
  doc.text("How it works:", 110, 100);
  
  doc.setFontSize(14);
  const steps = [
    "1. Scan the QR code",
    "2. Share your dining experience",
    "3. Add your receipt photo",
    "4. Get instant rewards for both tips & reviews"
  ];
  steps.forEach((step, index) => {
    doc.text(step, 110, 110 + (index * 10));
  });
  
  // Add rewards section
  doc.setFontSize(18);
  doc.text("Your EatUP! Journey", 20, 190);
  
  doc.setFontSize(14);
  const rewards = [
    `• Get ${reviewRewardAmount}% off your current bill when you review`,
    `• Earn ${tipRewardPercentage}% of your tip as future credit`,
    "• Get exclusive weekly offers in your inbox"
  ];
  rewards.forEach((reward, index) => {
    doc.text(reward, 20, 200 + (index * 10));
  });
  
  // Add URL and powered by text at bottom
  doc.setFontSize(10);
  doc.setTextColor(233, 78, 135);
  doc.text(url, 20, 270);
  
  doc.setTextColor(128, 128, 128);
  doc.text("Powered by EatUP! - The smart way to earn rewards", 20, 280);
};