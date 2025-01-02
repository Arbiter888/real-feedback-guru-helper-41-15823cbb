import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { SignupForm } from "./SignupForm";
import { SuccessMessage } from "./SuccessMessage";

interface EmailSignupProps {
  rewardCode: string | null;
  tipAmount?: number;
  tipRewardCode?: string;
  tipRewardAmount?: number;
  totalRewardValue: number;
}

export const EmailSignup = ({ 
  rewardCode,
  tipAmount,
  tipRewardCode,
  tipRewardAmount,
  totalRewardValue
}: EmailSignupProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEmailSignup = async () => {
    if (!firstName || !email) {
      toast({
        title: "Required fields missing",
        description: "Please enter both your first name and email address to sign up.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const reviewDataString = localStorage.getItem('reviewData');
      console.log('Raw review data:', reviewDataString);

      if (!reviewDataString && rewardCode) {
        throw new Error('No review data found');
      }

      let reviewInfo = null;
      if (reviewDataString) {
        reviewInfo = JSON.parse(reviewDataString);
        console.log('Parsed review info:', reviewInfo);
      }

      // Generate referral code
      const code = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).substring(2, 7)}`;
      const referralUrl = `${window.location.origin}/referral/${code}`;
      
      // Create QR code
      const { data: qrData, error: qrError } = await supabase.functions.invoke('generate-qr-code', {
        body: { url: referralUrl }
      });
      
      if (qrError) throw qrError;
      
      // Create referral code record
      const { error: referralError } = await supabase
        .from('referral_codes')
        .insert({
          referrer_name: firstName,
          referrer_email: email,
          restaurant_name: reviewInfo?.restaurantInfo?.restaurantName || 'Restaurant',
          code: code,
        });

      if (referralError) throw referralError;

      // Send rewards email
      const { error: emailError } = await supabase.functions.invoke('send-rewards-email', {
        body: {
          firstName,
          email,
          tipAmount,
          tipReward: tipRewardAmount,
          tipRewardCode,
          reviewRewardCode: rewardCode,
          restaurantInfo: reviewInfo?.restaurantInfo
        }
      });

      if (emailError) throw emailError;

      setReferralCode(code);
      setQrCodeUrl(qrData.qrCodeUrl);
      setIsSignedUp(true);
      
      toast({
        title: "Welcome to EatUP!",
        description: "Your rewards have been sent to your email!",
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send rewards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restaurantName = localStorage.getItem('restaurantInfo') 
    ? JSON.parse(localStorage.getItem('restaurantInfo')!).restaurantName 
    : 'Restaurant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50 rounded-xl border border-pink-100"
    >
      {!isSignedUp ? (
        <SignupForm
          firstName={firstName}
          email={email}
          isLoading={isLoading}
          setFirstName={setFirstName}
          setEmail={setEmail}
          onSubmit={handleEmailSignup}
          tipRewardAmount={tipRewardAmount}
          tipRewardCode={tipRewardCode}
        />
      ) : (
        <SuccessMessage
          tipAmount={tipAmount}
          referralCode={referralCode!}
          qrCodeUrl={qrCodeUrl!}
          firstName={firstName}
          restaurantName={restaurantName}
        />
      )}
    </motion.div>
  );
};