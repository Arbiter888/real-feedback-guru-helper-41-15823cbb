import { Gift, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      {/* Total Value Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <Card className="p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50">
          <h3 className="text-2xl font-bold text-gray-900">
            {tipAmount ? (
              <>
                Save {reviewRewardAmount}% today + £{tipRewardAmount?.toFixed(2)} for your next visit
              </>
            ) : (
              <>Save {reviewRewardAmount}% on your bill today</>
            )}
          </h3>
        </Card>
      </motion.div>

      {/* Server Instructions */}
      <Card className="p-4 bg-green-50/50 border-green-100">
        <div className="space-y-2">
          <p className="font-medium text-gray-900">Show this to your server:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li className="text-gray-700">{reviewRewardAmount}% off your current bill</li>
            {tipAmount && (
              <li className="text-gray-700">Add £{tipAmount.toFixed(2)} tip to the final amount</li>
            )}
          </ul>
        </div>
      </Card>

      {/* Reward Details */}
      <Card className="p-6">
        <Tabs defaultValue={tipRewardCode ? "tip" : "review"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="review" className="data-[state=active]:bg-primary/10">
              <Gift className="w-4 h-4 mr-2" />
              Review Reward
            </TabsTrigger>
            <TabsTrigger value="tip" disabled={!tipRewardCode} className="data-[state=active]:bg-primary/10">
              <Star className="w-4 h-4 mr-2" />
              Tip Reward
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="review">
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <p className="font-medium">Review Reward Details</p>
              </div>
              <p className="text-sm text-gray-600">
                Get {reviewRewardAmount}% off your current bill
              </p>
              {rewardCode && (
                <div className="pt-3 border-t border-pink-100">
                  <p className="text-sm text-gray-500 mb-1">Your Review Reward Code:</p>
                  <p className="text-lg font-mono font-bold text-primary">{rewardCode}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tip">
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <p className="font-medium">Tip Reward Details</p>
              </div>
              {tipAmount && tipRewardAmount ? (
                <>
                  <p className="text-sm text-gray-600">
                    £{tipAmount.toFixed(2)} tip will be added to your bill
                    <br />
                    Earn £{tipRewardAmount.toFixed(2)} credit for your next visit
                  </p>
                  {tipRewardCode && (
                    <div className="pt-3 border-t border-pink-100">
                      <p className="text-sm text-gray-500 mb-1">Your Tip Reward Code:</p>
                      <p className="text-lg font-mono font-bold text-primary">{tipRewardCode}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">No tip reward added yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Email Signup */}
        <EmailSignup 
          rewardCode={rewardCode}
          tipAmount={tipAmount}
          tipRewardCode={tipRewardCode}
          tipRewardAmount={tipRewardAmount}
          totalRewardValue={totalRewardValue}
        />
      </Card>
    </div>
  );
};