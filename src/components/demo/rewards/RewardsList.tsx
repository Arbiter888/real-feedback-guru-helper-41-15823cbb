import { ExternalLink } from "lucide-react";

interface RewardsListProps {
  hasUploadedReceipt?: boolean;
  customRestaurantName?: string;
}

export const RewardsList = ({ hasUploadedReceipt, customRestaurantName }: RewardsListProps) => {
  const restaurantName = customRestaurantName || "The Local Kitchen & Bar";

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-bold text-center text-gray-800 mt-12 mb-8">
        Your EatUP! Journey
      </h4>
      
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100/50 shadow-md hover:shadow-lg transition-all duration-300 space-y-8">
        {/* First Visit Section */}
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            1️⃣ Today's Visit
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600 space-y-2">
            <p>• Share your dining experience</p>
            <p>• Upload receipt for personalization</p>
            <p>• Get instant personalized reward</p>
            <p>• Join our smart loyalty program</p>
            {hasUploadedReceipt && (
              <p className="text-primary font-medium mt-2">
                Receipt uploaded! Sign up above to unlock your rewards journey!
              </p>
            )}
          </div>
        </div>

        {/* Progressive Rewards Section */}
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            🎯 Your Rewards Journey
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600 space-y-4">
            <div>
              <p className="font-medium text-primary">Second Visit:</p>
              <p>• Use your personalized voucher</p>
              <p>• Get weekly exclusive offers</p>
              <p>• Unlock next visit rewards</p>
            </div>
            <div>
              <p className="font-medium text-primary">Third Visit:</p>
              <p>• Premium rewards unlock</p>
              <p>• Special event invites</p>
              <p>• Bonus reward points</p>
            </div>
            <div>
              <p className="font-medium text-primary">Fourth Visit:</p>
              <p>• VIP status achieved</p>
              <p>• Priority booking access</p>
              <p>• Maximum reward benefits</p>
            </div>
          </div>
        </div>

        {/* Why Join Section */}
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            🏆 Benefits of Joining
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600 space-y-3">
            <div>
              <p className="font-medium text-primary">Instant + Weekly Rewards</p>
              <p>Get rewarded today AND receive exclusive weekly offers!</p>
            </div>
            <div>
              <p className="font-medium text-primary">AI-Powered Personalization</p>
              <p>Receive vouchers tailored to your dining preferences</p>
            </div>
            <div>
              <p className="font-medium text-primary">Progressive Benefits</p>
              <p>Better rewards and perks with each visit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};