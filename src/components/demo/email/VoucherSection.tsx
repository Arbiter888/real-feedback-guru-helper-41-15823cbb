import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import QRCode from "qrcode";
import { nanoid } from "nanoid";

interface VoucherSectionProps {
  onVoucherGenerated: (voucherHtml: string) => void;
}

export const VoucherSection = ({ onVoucherGenerated }: VoucherSectionProps) => {
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const generateVoucher = async () => {
    if (!offerTitle || !offerDescription) return;

    const uniqueCode = nanoid(8).toUpperCase();
    setVoucherCode(uniqueCode);

    // Generate QR code
    const qrData = await QRCode.toDataURL(uniqueCode);
    setQrCodeUrl(qrData);

    // Generate voucher HTML with the new design
    const voucherHtml = `
      <div style="margin: 2rem 0; text-align: center;">
        <div style="background-color: #FFF5F8; padding: 2rem; border-radius: 12px; max-width: 400px; margin: 0 auto;">
          <h2 style="color: #E94E87; font-size: 1.25rem; margin-bottom: 0.5rem;">Special Reward for Your Next Visit!</h2>
          <p style="font-size: 1.125rem; margin: 0.5rem 0;">${offerTitle}</p>
          <p style="color: #666; margin: 0.5rem 0;">Show code: ${uniqueCode}</p>
          ${qrData ? `<img src="${qrData}" alt="Voucher QR Code" style="width: 150px; height: 150px; margin: 1rem auto;" />` : ''}
          <p style="font-size: 0.875rem; color: #666; margin-top: 1rem;">${offerDescription}</p>
        </div>
      </div>
    `;

    onVoucherGenerated(voucherHtml);
  };

  return (
    <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
      <h3 className="font-semibold text-lg">Voucher Details</h3>
      
      <div className="space-y-2">
        <Label htmlFor="offerTitle">Offer Title</Label>
        <Input
          id="offerTitle"
          value={offerTitle}
          onChange={(e) => setOfferTitle(e.target.value)}
          placeholder="e.g., 10% off next visit"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="offerDescription">Offer Description</Label>
        <Textarea
          id="offerDescription"
          value={offerDescription}
          onChange={(e) => setOfferDescription(e.target.value)}
          placeholder="Enter the details and terms of your offer"
        />
      </div>

      {qrCodeUrl && (
        <div className="bg-pink-50/50 rounded-xl p-6 text-center space-y-2">
          <h3 className="text-primary font-medium text-lg">Special Reward for Your Next Visit!</h3>
          <p className="text-lg">{offerTitle}</p>
          <p className="text-gray-600">Show code: {voucherCode}</p>
          <img src={qrCodeUrl} alt="Voucher QR Code" className="w-32 h-32 mx-auto my-4" />
          <p className="text-sm text-gray-600">{offerDescription}</p>
        </div>
      )}

      <Button 
        onClick={generateVoucher}
        className="w-full"
        disabled={!offerTitle || !offerDescription}
      >
        Generate Voucher
      </Button>
    </div>
  );
};