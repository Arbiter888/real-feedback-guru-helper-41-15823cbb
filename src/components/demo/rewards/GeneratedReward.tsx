import { Gift, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { EmailSignup } from "./EmailSignup";
import { ReferralSignupForm } from "./ReferralSignupForm";

interface GeneratedRewardProps {
  rewardCode: string | null;
  reviewRewardAmount?: number;
  tipRewardCode?: string;
  tipAmount?: number;
  tipRewardAmount?: number;
  reviewId?: string;
  restaurantName?: string;
  reviewText?: string;
}

export const GeneratedReward = ({ 
  rewardCode,
  reviewRewardAmount = 10,
  tipRewardCode,
  tipAmount,
  tipRewardAmount,
  reviewId,
  restaurantName,
  reviewText
}: GeneratedRewardProps) => {
  if (!rewardCode && !tipRewardCode) return null;

  const totalRewardValue = (tipRewardAmount || 0) + (rewardCode ? reviewRewardAmount : 0);

  return (
    <div className="space-y-6">
      {/* Total Value Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <Card className="p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50">
          <h3 className="text-2xl font-bold text-gray-900">
            {tipAmount ? (
              <>
                Save {reviewRewardAmount}% today + £{tipRewardAmount?.toFixed(2)} for your next visit
              </>
            ) : (
              <>Save {reviewRewardAmount}% on your bill today</>
            )}
          </h3>
        </Card>
      </motion.div>

      {/* Email Signup */}
      <Card className="p-6">
        <EmailSignup 
          rewardCode={rewardCode}
          tipAmount={tipAmount}
          tipRewardCode={tipRewardCode}
          tipRewardAmount={tipRewardAmount}
          totalRewardValue={totalRewardValue}
        />
      </Card>

      {/* Referral Signup */}
      {reviewId && restaurantName && reviewText && (
        <Card className="p-6">
          <ReferralSignupForm
            reviewId={reviewId}
            restaurantName={restaurantName}
            reviewText={reviewText}
          />
        </Card>
      )}
    </div>
  );
};