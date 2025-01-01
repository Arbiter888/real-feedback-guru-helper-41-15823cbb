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
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("EAT. EARN. SAVE.", 105, 55, { align: "center" });
  
  // Add horizontal line
  doc.setDrawColor(233, 78, 135);
  doc.setLineWidth(0.5);
  doc.line(40, 65, 170, 65);
  
  // Add QR code with white background and border
  const qrImg = await loadImage(qrCodeUrl);
  doc.setFillColor(255, 255, 255);
  doc.rect(55, 80, 100, 100, "F");
  doc.setDrawColor(233, 78, 135);
  doc.setLineWidth(0.5);
  doc.rect(55, 80, 100, 100);
  doc.addImage(qrImg, "PNG", 57.5, 82.5, 95, 95);
  
  // Add reward text with improved hierarchy
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Get Rewarded for", 105, 200, { align: "center" });
  doc.text("Tips & Reviews", 105, 215, { align: "center" });
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`Get ${reviewRewardAmount}% off now`, 105, 235, { align: "center" });
  doc.text(`+ ${tipRewardPercentage}% tip credit`, 105, 250, { align: "center" });
  
  // Add URL and powered by text at bottom
  doc.setFontSize(10);
  doc.setTextColor(233, 78, 135);
  doc.text(url, 105, 270, { align: "center" });
  
  doc.setTextColor(128, 128, 128);
  doc.text("Powered by EatUP! - The smart way to earn rewards", 105, 280, { align: "center" });
};