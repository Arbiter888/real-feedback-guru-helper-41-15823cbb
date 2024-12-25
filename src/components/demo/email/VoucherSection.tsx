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

    // Generate voucher HTML
    const voucherHtml = `
      <div style="border: 2px dashed #E94E87; padding: 20px; margin: 20px 0; text-align: center; max-width: 500px;">
        <h2 style="color: #E94E87; margin-bottom: 15px;">${offerTitle}</h2>
        <p style="margin-bottom: 15px;">${offerDescription}</p>
        <img src="${qrData}" alt="Voucher QR Code" style="width: 150px; height: 150px; margin: 15px auto;" />
        <p style="font-family: monospace; font-size: 18px; font-weight: bold; margin: 15px 0;">
          ${uniqueCode}
        </p>
        <p style="font-size: 12px; color: #666;">
          Present this code or QR code to redeem your offer
        </p>
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
          placeholder="e.g., 20% Off Your Next Visit"
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
        <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
          <img src={qrCodeUrl} alt="Voucher QR Code" className="w-32 h-32" />
          <p className="font-mono font-bold">{voucherCode}</p>
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