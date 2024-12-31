import { GeneratedReward } from "./rewards/GeneratedReward";

interface RewardsSectionProps {
  rewardCode: string | null;
  hasUploadedReceipt?: boolean;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
}

export const RewardsSection = ({ 
  rewardCode, 
  hasUploadedReceipt,
  customGoogleMapsUrl,
  customRestaurantName 
}: RewardsSectionProps) => {
  return (
    <section className="space-y-6">
      <GeneratedReward rewardCode={rewardCode} />
    </section>
  );
};