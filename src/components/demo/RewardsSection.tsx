import { GeneratedReward } from "./rewards/GeneratedReward";

interface RewardsSectionProps {
  rewardCode: string | null;
  hasUploadedReceipt?: boolean;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
  reviewRewardAmount?: number;
  tipRewardCode?: string;
  tipAmount?: number;
  tipRewardAmount?: number;
}

export const RewardsSection = ({ 
  rewardCode, 
  hasUploadedReceipt,
  customGoogleMapsUrl,
  customRestaurantName,
  reviewRewardAmount = 10,
  tipRewardCode,
  tipAmount,
  tipRewardAmount
}: RewardsSectionProps) => {
  return (
    <section className="space-y-6">
      <GeneratedReward 
        rewardCode={rewardCode} 
        reviewRewardAmount={reviewRewardAmount}
        tipRewardCode={tipRewardCode}
        tipAmount={tipAmount}
        tipRewardAmount={tipRewardAmount}
      />
    </section>
  );
};