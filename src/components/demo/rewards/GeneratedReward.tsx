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
  if (!rewardCode && !tipRewardCode) return null;

  const totalRewardValue = (tipRewardAmount || 0) + (rewardCode ? reviewRewardAmount : 0);

  return (
    <div className="space-y-6">
      {/* Total Rewards Value Display */}
      <Card className="p-4 bg-pink-50/50">
        <div className="flex items-center justify-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">
            Total Rewards Value: £{totalRewardValue.toFixed(2)}
          </h3>
        </div>
      </Card>

      {/* Combined Rewards Display */}
      <Card className="p-6 space-y-6">
        <Tabs defaultValue={tipRewardCode ? "tip" : "review"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {tipRewardCode && (
              <TabsTrigger value="tip" className="data-[state=active]:bg-primary/10">
                <Star className="w-4 h-4 mr-2" />
                Tip Reward
              </TabsTrigger>
            )}
            {rewardCode && (
              <TabsTrigger value="review" className="data-[state=active]:bg-primary/10">
                <Gift className="w-4 h-4 mr-2" />
                Review Reward
              </TabsTrigger>
            )}
          </TabsList>
          
          {tipRewardCode && (
            <TabsContent value="tip">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">Tip Reward Details</p>
                    <p className="text-sm text-gray-600">
                      £{tipRewardAmount?.toFixed(2)} credit for your next visit from your £{tipAmount?.toFixed(2)} tip
                    </p>
                    <div className="pt-3 border-t border-pink-100">
                      <p className="text-sm text-gray-500 mb-1">Your Tip Reward Code:</p>
                      <p className="text-lg font-mono font-bold text-primary">{tipRewardCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
          
          {rewardCode && (
            <TabsContent value="review">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">Review Reward Details</p>
                    <p className="text-sm text-gray-600">
                      £{reviewRewardAmount} off your current bill for sharing your experience
                    </p>
                    <div className="pt-3 border-t border-pink-100">
                      <p className="text-sm text-gray-500 mb-1">Your Review Reward Code:</p>
                      <p className="text-lg font-mono font-bold text-primary">{rewardCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </Card>

      {/* Single Email Signup Section */}
      <EmailSignup 
        rewardCode={rewardCode}
        reviewRewardAmount={reviewRewardAmount}
        totalRewardValue={totalRewardValue}
        tipAmount={tipAmount}
        tipRewardCode={tipRewardCode}
        tipRewardAmount={tipRewardAmount}
      />

      <p className="text-center text-sm text-gray-500">
        All rewards valid for 30 days from issue
      </p>
    </div>
  );
};