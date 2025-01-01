import jsPDF from "jspdf";

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  const img = new Image();
  img.src = src;
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
  });
};

export const drawCutLines = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([1, 1], 0);
  // Horizontal cut lines
  doc.line(x - 5, y, x, y);
  doc.line(x + width, y, x + width + 5, y);
  doc.line(x - 5, y + height, x, y + height);
  doc.line(x + width, y + height, x + width + 5, y + height);
  // Vertical cut lines
  doc.line(x, y - 5, x, y);
  doc.line(x, y + height, x, y + height + 5);
  doc.line(x + width, y - 5, x + width, y);
  doc.line(x + width, y + height, x + width, y + height + 5);
};

export const drawFoldLine = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  doc.setLineDashPattern([0.5, 0.5], 0);
  doc.line(x, y + height * 0.75, x + width, y + height * 0.75);
};