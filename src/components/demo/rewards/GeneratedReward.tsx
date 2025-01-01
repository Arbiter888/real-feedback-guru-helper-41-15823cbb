import { Gift, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmailSignup } from "./EmailSignup";

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

  const totalRewardValue = (tipRewardAmount || 0) + (rewardCode ? reviewRewardAmount : 0);

  return (
    <div className="space-y-6">
      {/* Total Rewards Value Display */}
      {totalRewardValue > 0 && (
        <Card className="p-4 bg-pink-50/50">
          <div className="flex items-center justify-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">
              Total Rewards Value: £{totalRewardValue.toFixed(2)}
            </h3>
          </div>
        </Card>
      )}

      {/* Combined Rewards Display */}
      <Card className="p-6 space-y-6">
        {/* Review Reward Section */}
        {rewardCode && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-lg">Review Reward</h4>
            </div>
            <p>£{reviewRewardAmount} off your current bill for sharing your experience</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your Review Reward Code:</p>
              <p className="font-mono font-bold text-primary text-lg">{rewardCode}</p>
            </div>
          </div>
        )}

        {/* Tip Reward Section */}
        {tipRewardCode && (
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-lg">Tip Reward</h4>
            </div>
            <p>£{tipRewardAmount?.toFixed(2)} credit for your next visit from your £{tipAmount?.toFixed(2)} tip</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your Tip Reward Code:</p>
              <p className="font-mono font-bold text-primary text-lg">{tipRewardCode}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Single Email Signup Section */}
      <EmailSignup 
        rewardCode={rewardCode}
        reviewRewardAmount={reviewRewardAmount}
        totalRewardValue={totalRewardValue}
      />

      <p className="text-center text-sm text-gray-500">
        All rewards valid for 30 days from issue
      </p>
    </div>
  );
};