import { GeneratedReward } from "./rewards/GeneratedReward";

interface RewardsSectionProps {
  rewardCode: string | null;
  hasUploadedReceipt?: boolean;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
  reviewRewardAmount?: number;
}

export const RewardsSection = ({ 
  rewardCode, 
  hasUploadedReceipt,
  customGoogleMapsUrl,
  customRestaurantName,
  reviewRewardAmount = 10
}: RewardsSectionProps) => {
  return (
    <section className="space-y-6">
      <GeneratedReward 
        rewardCode={rewardCode} 
        reviewRewardAmount={reviewRewardAmount}
      />
    </section>
  );
};