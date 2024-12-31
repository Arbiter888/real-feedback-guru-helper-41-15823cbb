import { GeneratedReward } from "./rewards/GeneratedReward";
import { RewardsList } from "./rewards/RewardsList";

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

      <div className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50 p-4 sm:p-6">
          <RewardsList 
            hasUploadedReceipt={hasUploadedReceipt}
            customRestaurantName={customRestaurantName}
          />
        </div>
      </div>
    </section>
  );
};