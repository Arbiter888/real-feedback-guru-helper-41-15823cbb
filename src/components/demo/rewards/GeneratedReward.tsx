import { Gift, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmailSignup } from "./EmailSignup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const totalRewardValue = (tipRewardAmount || 0) + (rewardCode ? reviewRewardAmount : 0);

  if (!rewardCode && !tipRewardCode) return null;

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

      {/* Rewards Details */}
      <Tabs defaultValue={tipRewardCode ? "tip" : "review"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {tipRewardCode && (
            <TabsTrigger value="tip" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Tip Reward
            </TabsTrigger>
          )}
          {rewardCode && (
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Review Reward
            </TabsTrigger>
          )}
        </TabsList>

        {tipRewardCode && (
          <TabsContent value="tip">
            <Card className="p-6 space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Tip Reward Details
              </h4>
              <p>£{tipRewardAmount?.toFixed(2)} credit from your £{tipAmount?.toFixed(2)} tip</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Your Tip Reward Code:</p>
                <p className="font-mono font-bold text-primary text-lg">{tipRewardCode}</p>
              </div>
            </Card>
          </TabsContent>
        )}

        {rewardCode && (
          <TabsContent value="review">
            <Card className="p-6 space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Review Reward Details
              </h4>
              <p>£{reviewRewardAmount} reward for sharing your experience</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Your Review Reward Code:</p>
                <p className="font-mono font-bold text-primary text-lg">{rewardCode}</p>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>

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