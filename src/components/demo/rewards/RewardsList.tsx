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
        {/* Today's Visit Section */}
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

        {/* What's Next Section */}
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            📧 What's Next
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600 space-y-3">
            <div>
              <p className="font-medium text-primary">Thank You Email</p>
              <p>Receive a personalized thank you email with a special voucher for your next visit</p>
            </div>
            <div>
              <p className="font-medium text-primary">Weekly Exclusives</p>
              <p>Get added to our rewards program for exclusive weekly offers and updates</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div>
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            🏆 Benefits of Joining
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600 space-y-3">
            <div>
              <p className="font-medium text-primary">Instant Rewards</p>
              <p>Get rewarded today for sharing your experience!</p>
            </div>
            <div>
              <p className="font-medium text-primary">AI-Powered Personalization</p>
              <p>Receive vouchers tailored to your dining preferences</p>
            </div>
            <div>
              <p className="font-medium text-primary">Exclusive Updates</p>
              <p>Stay informed about special offers and events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};