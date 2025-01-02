import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Loader2 } from "lucide-react";
import { generateAndUploadQRCode } from "@/utils/qrCodeUtils";

interface ReferralSignupFormProps {
  reviewId: string;
  restaurantName: string;
  reviewText: string;
}

export const ReferralSignupForm = ({ reviewId, restaurantName, reviewText }: ReferralSignupFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      // Generate a unique referral code
      const code = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).substring(2, 7)}`;
      
      // Create referral code record
      const { data: referralData, error: referralError } = await supabase
        .from('referral_codes')
        .insert({
          referrer_name: name,
          referrer_email: email,
          restaurant_name: restaurantName,
          review_id: reviewId,
          code: code,
        })
        .select()
        .single();

      if (referralError) throw referralError;

      // Generate QR code for the referral link
      const referralUrl = `${window.location.origin}/referral/${code}`;
      const qrUrl = await generateAndUploadQRCode(referralUrl);
      
      setQrCodeUrl(qrUrl);
      setReferralCode(code);

      toast({
        title: "Referral code created!",
        description: "Share your QR code with friends to earn rewards.",
      });
    } catch (error) {
      console.error('Error creating referral:', error);
      toast({
        title: "Error",
        description: "Failed to create referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (referralCode && qrCodeUrl) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">Thanks {name}!</h3>
          <p className="text-gray-600">Share your personal restaurant recommendation</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <img src={qrCodeUrl} alt="Referral QR Code" className="w-48 h-48 mx-auto" />
        </div>

        <div className="space-y-2">
          <p className="font-medium">When friends use your code, they'll get:</p>
          <ul className="text-gray-600 space-y-1">
            <li>• A special welcome voucher</li>
            <li>• Exclusive first-time visitor perks</li>
          </ul>
        </div>

        <p className="text-primary font-medium">Share the love, spread the flavor!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          One last thing!
        </h3>
        <p className="text-gray-600">
          Want to share {restaurantName} with friends?
        </p>
        <p className="text-sm text-gray-600">
          Enter your details and we'll create a personal referral code for you. When friends use your code, they'll get a special welcome offer!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating your code...
            </>
          ) : (
            <>
              <Gift className="mr-2 h-4 w-4" />
              Create my referral code
            </>
          )}
        </Button>
      </form>
    </div>
  );
};