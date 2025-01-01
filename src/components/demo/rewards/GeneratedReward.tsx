import { Gift, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { EmailSignup } from "./EmailSignup";
import { EnhancedRewardDisplay } from "./EnhancedRewardDisplay";

interface GeneratedRewardProps {
  rewardCode: string | null;
  reviewRewardAmount?: number;
  tipRewardCode?: string;
  tipAmount?: number;
  tipRewardAmount?: number;
}

export const GeneratedReward = ({ 
  rewardCode, 
  reviewRewardAmount = 10,
  tipRewardCode,
  tipAmount,
  tipRewardAmount
}: GeneratedRewardProps) => {
  if (!rewardCode && !tipRewardCode) return null;

  const totalReward = (tipRewardAmount || 0) + (rewardCode ? reviewRewardAmount : 0);

  const handleClaimRewards = (email: string) => {
    // Pass the email to the EmailSignup component's existing logic
    // This maintains the current functionality while using the new UI
  };

  return (
    <section className="space-y-6">
      <EnhancedRewardDisplay
        discountPercentage={reviewRewardAmount}
        creditAmount={tipRewardAmount || 0}
        tipAmount={tipAmount}
        totalReward={totalReward}
        onClaimRewards={handleClaimRewards}
      />
    </section>
  );
};
