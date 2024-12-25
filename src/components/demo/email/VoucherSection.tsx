import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VoucherSectionProps {
  onVoucherGenerated: (voucherHtml: string) => void;
}

interface SuggestedVoucher {
  title: string;
  description: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export const VoucherSection = ({ onVoucherGenerated }: VoucherSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedVouchers, setSuggestedVouchers] = useState<SuggestedVoucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<SuggestedVoucher | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const getSuggestedVouchers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-vouchers', {
        body: { 
          sentiment: 'positive' // You can make this dynamic based on review sentiment
        },
      });

      if (error) throw error;

      setSuggestedVouchers(data.vouchers);
    } catch (error) {
      console.error('Error getting voucher suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to get voucher suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateVoucherFromSuggestion = async (voucher: SuggestedVoucher) => {
    setSelectedVoucher(voucher);
    const uniqueCode = nanoid(8).toUpperCase();
    setVoucherCode(uniqueCode);

    try {
      const qrData = await QRCode.toDataURL(uniqueCode);
      setQrCodeUrl(qrData);

      const voucherHtml = `
        <div style="margin: 2rem 0; text-align: center;">
          <div style="background-color: #FFF5F8; padding: 2rem; border-radius: 12px; max-width: 300px; margin: 0 auto;">
            <h2 style="color: #E94E87; font-size: 1.25rem; margin-bottom: 1rem;">Special Reward for Your Next Visit!</h2>
            <p style="font-size: 1.125rem; margin: 0.75rem 0; color: #333;">${voucher.title}</p>
            <p style="color: #666; font-size: 1rem; margin: 0.75rem 0;">Show code: ${uniqueCode}</p>
            ${qrData ? `<img src="${qrData}" alt="QR Code" style="width: 120px; height: 120px; margin: 0.75rem auto; display: block;" />` : ''}
            <p style="font-size: 0.875rem; color: #666; margin-top: 0.75rem;">${voucher.description}</p>
          </div>
        </div>
      `;

      onVoucherGenerated(voucherHtml);
    } catch (error) {
      console.error('Error generating voucher:', error);
      toast({
        title: "Error",
        description: "Failed to generate voucher. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">AI Suggested Vouchers</h3>
        <Button 
          onClick={getSuggestedVouchers}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Get Suggestions
        </Button>
      </div>

      {suggestedVouchers.length > 0 && (
        <div className="space-y-3">
          {suggestedVouchers.map((voucher, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-primary ${
                selectedVoucher === voucher ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => generateVoucherFromSuggestion(voucher)}
            >
              <h4 className="font-medium text-lg">{voucher.title}</h4>
              <p className="text-sm text-gray-600">{voucher.description}</p>
            </div>
          ))}
        </div>
      )}

      {selectedVoucher && qrCodeUrl && (
        <div className="bg-pink-50/50 rounded-xl p-6 text-center space-y-2">
          <h3 className="text-primary font-medium text-lg">Selected Voucher</h3>
          <p className="text-lg">{selectedVoucher.title}</p>
          <p className="text-gray-600">Show code: {voucherCode}</p>
          <img src={qrCodeUrl} alt="Voucher QR Code" className="w-32 h-32 mx-auto my-3" />
          <p className="text-sm text-gray-600">{selectedVoucher.description}</p>
        </div>
      )}
    </div>
  );
};