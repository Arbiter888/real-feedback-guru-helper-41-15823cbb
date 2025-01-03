import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share, Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReferralEmailSectionProps {
  referrerName: string;
  restaurantName: string;
  qrCodeUrl: string;
  referralCode: string;
  restaurantLogo?: string;
  refinedReview?: string;
  starsCount?: number;
}

export const ReferralEmailSection = ({
  referrerName,
  restaurantName,
  qrCodeUrl,
  referralCode,
  restaurantLogo,
  refinedReview,
  starsCount = 0
}: ReferralEmailSectionProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const generateDownloadPage = async () => {
    setIsGenerating(true);
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      
      const { data, error } = await supabase.functions.invoke('generate-referral-page', {
        body: {
          referralCode,
          restaurantName,
          qrCodeUrl,
          restaurantLogo,
          refinedReview,
          referrerName,
          expirationDate: expirationDate.toLocaleDateString(),
          termsAndConditions: "Terms and conditions apply. One voucher per person.",
          starsCount
        },
      });

      if (error) throw error;
      setDownloadUrl(data.downloadUrl);
      
      toast({
        title: "Download page generated!",
        description: "Your referral page is ready to share.",
      });
    } catch (error) {
      console.error('Error generating download page:', error);
      toast({
        title: "Error",
        description: "Failed to generate download page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareOnWhatsApp = () => {
    const text = `Hey! Check out ${restaurantName}! ${refinedReview ? `Here's what I experienced: "${refinedReview}" ` : ''}Use my referral link to get a special welcome offer: ${downloadUrl || qrCodeUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Thanks {referrerName}!</h2>
        <p className="text-gray-600">
          Share your personal restaurant recommendation
        </p>
      </div>

      <div className="flex justify-center">
        <img src={qrCodeUrl} alt="Referral QR Code" className="w-48 h-48" />
      </div>

      {refinedReview && (
        <Card className="p-4 bg-gray-50 space-y-2">
          <div className="flex items-start gap-2">
            <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-gray-700 italic">{refinedReview}</p>
              <p className="text-sm text-primary font-medium">- {referrerName}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold">Your friends will receive:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>A special welcome voucher</li>
          <li>Exclusive first-time visitor perks</li>
        </ul>
      </div>

      {starsCount > 0 && (
        <div className="text-center space-y-2">
          <div className="flex justify-center gap-2">
            {Array(3).fill(0).map((_, i) => (
              <span key={i} className="text-2xl">
                {i < starsCount ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {starsCount}/3 stars collected
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Button
          onClick={generateDownloadPage}
          disabled={isGenerating}
          variant="outline"
        >
          {isGenerating ? (
            "Generating download page..."
          ) : (
            "Generate shareable page"
          )}
        </Button>

        {downloadUrl && (
          <>
            <Button
              onClick={() => window.open(downloadUrl, '_blank')}
              variant="default"
            >
              View download page
            </Button>
            <Button
              onClick={shareOnWhatsApp}
              variant="default"
              className="bg-[#25D366] hover:bg-[#128C7E]"
            >
              <Share className="w-4 h-4 mr-2" />
              Share on WhatsApp
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};