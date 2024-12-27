import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import { Wand2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VoucherSectionProps {
  onVoucherGenerated: (voucherHtml: string) => void;
}

export const VoucherSection = ({ onVoucherGenerated }: VoucherSectionProps) => {
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const { toast } = useToast();

  const generateVoucher = async () => {
    if (!offerTitle || !offerDescription) return;

    const uniqueCode = nanoid(8).toUpperCase();
    setVoucherCode(uniqueCode);

    const qrData = await QRCode.toDataURL(uniqueCode);
    setQrCodeUrl(qrData);

    const voucherHtml = `
      <div style="margin: 2rem 0; text-align: center;">
        <div style="background-color: #FFF5F8; padding: 2rem; border-radius: 12px; max-width: 300px; margin: 0 auto;">
          <h2 style="color: #E94E87; font-size: 1.25rem; margin-bottom: 1rem;">Special Reward for Your Next Visit!</h2>
          <p style="font-size: 1.125rem; margin: 0.75rem 0; color: #333;">${offerTitle}</p>
          <p style="color: #666; font-size: 1rem; margin: 0.75rem 0;">Show code: ${uniqueCode}</p>
          ${qrData ? `<img src="${qrData}" alt="QR Code" style="width: 120px; height: 120px; margin: 0.75rem auto; display: block;" />` : ''}
          <p style="font-size: 0.875rem; color: #666; margin-top: 0.75rem;">${offerDescription}</p>
        </div>
      </div>
    `;

    onVoucherGenerated(voucherHtml);
  };

  const generateSuggestion = async () => {
    setIsGeneratingSuggestion(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-voucher', {
        body: {
          customerName: "Customer",
          reviewText: "Positive review",
        }
      });
      
      if (error) throw error;

      setOfferTitle(data.title);
      setOfferDescription(data.description);

      toast({
        title: "Suggestion generated",
        description: "AI has suggested a new voucher offer.",
      });
    } catch (error: any) {
      console.error('Suggestion error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate voucher suggestion.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  return (
    <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Voucher Details</h3>
        <Button
          onClick={generateSuggestion}
          variant="outline"
          size="sm"
          disabled={isGeneratingSuggestion}
        >
          {isGeneratingSuggestion ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Suggesting...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              AI Suggest
            </>
          )}
        </Button>
      </div>
      
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
          placeholder="e.g., Valid Monday to Thursday only. Excludes public holidays."
        />
      </div>

      {qrCodeUrl && (
        <div className="bg-pink-50/50 rounded-xl p-6 text-center space-y-2">
          <h3 className="text-primary font-medium text-lg">Special Reward for Your Next Visit!</h3>
          <p className="text-lg">{offerTitle}</p>
          <p className="text-gray-600">Show code: {voucherCode}</p>
          <img src={qrCodeUrl} alt="Voucher QR Code" className="w-32 h-32 mx-auto my-3" />
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