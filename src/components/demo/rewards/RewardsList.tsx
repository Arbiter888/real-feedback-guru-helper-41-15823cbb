import { ExternalLink } from "lucide-react";

interface RewardsListProps {
  hasUploadedReceipt?: boolean;
  customRestaurantName?: string;
}

export const RewardsList = ({ hasUploadedReceipt, customRestaurantName }: RewardsListProps) => {
  const restaurantName = customRestaurantName || "The Local Kitchen & Bar";

  return (
    <div className="space-y-6">
      <h4 className="text-xl font-bold text-center text-gray-800 mt-8 mb-6">
        Your EatUP! Journey
      </h4>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50 divide-y divide-gray-100">
        <div className="p-4 sm:p-6">
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            1️⃣ Today's Visit
          </h4>
          <ul className="space-y-2 text-gray-600">
            <li>• Share your dining experience</li>
            <li>• Upload receipt for personalization</li>
            <li>• Get instant personalized reward</li>
            <li>• Join our smart loyalty program</li>
          </ul>
          {hasUploadedReceipt && (
            <p className="text-primary font-medium mt-3">
              Receipt uploaded! Sign up above to unlock your rewards journey!
            </p>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            📧 What's Next
          </h4>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-primary">Thank You Email</p>
              <p className="text-gray-600">Receive a personalized thank you email with a special voucher for your next visit</p>
            </div>
            <div>
              <p className="font-medium text-primary">Weekly Exclusives</p>
              <p className="text-gray-600">Get added to our rewards program for exclusive weekly offers and updates</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <h4 className="font-semibold text-lg text-gray-800 mb-3">
            🏆 Benefits of Joining
          </h4>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-primary">Instant Rewards</p>
              <p className="text-gray-600">Get rewarded today for sharing your experience!</p>
            </div>
            <div>
              <p className="font-medium text-primary">AI-Powered Personalization</p>
              <p className="text-gray-600">Receive vouchers tailored to your dining preferences</p>
            </div>
            <div>
              <p className="font-medium text-primary">Exclusive Updates</p>
              <p className="text-gray-600">Stay informed about special offers and events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};