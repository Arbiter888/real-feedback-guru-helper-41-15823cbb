import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { saveReviewData } from "./ReviewDataManager";

interface EmailSignupProps {
  rewardCode: string | null;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
  reviewRewardAmount?: number;
  totalRewardValue: number;
  tipAmount?: number;
  tipRewardCode?: string;
  tipRewardAmount?: number;
}

export const EmailSignup = ({ 
  rewardCode,
  customGoogleMapsUrl,
  customRestaurantName,
  reviewRewardAmount = 10,
  totalRewardValue,
  tipAmount,
  tipRewardCode,
  tipRewardAmount
}: EmailSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to sign up.",
        variant: "destructive",
      });
      return;
    }

    if (!rewardCode && !tipRewardCode) {
      toast({
        title: "No rewards available",
        description: "Please complete your review or add a tip to receive rewards.",
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

      // First, get or create the restaurant's email list
      const { data: listData, error: listError } = await supabase
        .rpc('get_or_create_restaurant_email_list', {
          restaurant_name: customRestaurantName || "The Local Kitchen & Bar"
        });

      if (listError) throw listError;

      // Save review data if it exists
      if (reviewInfo) {
        await saveReviewData(email, listData, {
          reviewText: reviewInfo.reviewText?.trim() || '',
          refinedReview: reviewInfo.refinedReview?.trim(),
          analysisResult: reviewInfo.analysisResult,
          serverName: reviewInfo.serverName?.trim(),
          rewardCode,
          googleMapsUrl: customGoogleMapsUrl,
          restaurantName: customRestaurantName,
          reviewRewardAmount
        });
      }

      // Get restaurant info from localStorage if available
      const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
      const restaurantInfo = savedRestaurantInfo ? JSON.parse(savedRestaurantInfo) : {};

      // Send welcome email with all rewards
      const { error: emailError } = await supabase.functions.invoke('send-rewards-email', {
        body: {
          email,
          tipAmount,
          tipReward: tipRewardAmount,
          tipRewardCode,
          reviewRewardCode: rewardCode,
          restaurantInfo,
          reviewRewardAmount
        }
      });

      if (emailError) throw emailError;

      // Save tip voucher if applicable
      if (tipAmount && tipRewardAmount && tipRewardCode) {
        const { error: voucherError } = await supabase
          .from('tip_vouchers')
          .insert({
            tip_amount: tipAmount,
            voucher_amount: tipRewardAmount,
            voucher_code: tipRewardCode,
            customer_email: email,
            server_name: reviewInfo?.serverName || '',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (voucherError) throw voucherError;
      }

      toast({
        title: "Success!",
        description: "Thank you for signing up! Check your email for your rewards.",
      });

      setEmail("");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-pink-50/50 p-6 rounded-xl border border-pink-100">
        <div className="flex items-center justify-center gap-3">
          <h3 className="font-bold text-2xl bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] text-transparent bg-clip-text">
            Join EatUP! Rewards
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Get instant access to £{totalRewardValue.toFixed(2)} in rewards plus exclusive weekly offers
          </p>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email to receive rewards"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleEmailSignup}
              disabled={isLoading || !email}
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Get Your Rewards"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};