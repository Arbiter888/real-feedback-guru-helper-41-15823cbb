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

  // Calculate example savings based on a £100 bill for illustration
  const exampleBillAmount = 100;
  const reviewSavings = (exampleBillAmount * (reviewRewardAmount / 100)).toFixed(2);
  const totalRewardValue = (tipRewardAmount || 0) + (rewardCode ? reviewRewardAmount : 0);
  
  const getRewardsMessage = () => {
    if (tipAmount && tipRewardAmount) {
      return `Save £${reviewSavings} on today's bill plus earn £${tipRewardAmount.toFixed(2)} credit for your next visit`;
    }
    return `Save ${reviewRewardAmount}% on today's bill (£${reviewSavings} off a £${exampleBillAmount} bill)`;
  };

  const getServerInstructions = () => {
    const instructions = [`${reviewRewardAmount}% off the current bill`];
    if (tipAmount) {
      instructions.push(`Add £${tipAmount.toFixed(2)} tip to the final amount`);
    }
    return instructions;
  };
  
  return (
    <div className="space-y-6">
      {/* Total Rewards Value Display */}
      <Card className="p-4 bg-pink-50/50">
        <div className="flex items-center justify-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">
            {getRewardsMessage()}
          </h3>
        </div>
      </Card>

      {/* Server Instructions */}
      <Card className="p-4 bg-green-50/50 border-green-100">
        <div className="space-y-2">
          <p className="font-medium text-gray-900">Show this to your server to receive:</p>
          <ul className="list-disc pl-6 space-y-1">
            {getServerInstructions().map((instruction, index) => (
              <li key={index} className="text-gray-700">{instruction}</li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Combined Rewards Display */}
      <Card className="p-6 space-y-6">
        <Tabs defaultValue={tipRewardCode ? "tip" : "review"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="review" className="data-[state=active]:bg-primary/10">
              <Gift className="w-4 h-4 mr-2" />
              Review Reward
            </TabsTrigger>
            <TabsTrigger value="tip" className="data-[state=active]:bg-primary/10">
              <Star className="w-4 h-4 mr-2" />
              Tip Reward
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="review">
            <Card className="p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50">
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Review Reward Details</p>
                  <p className="text-sm text-gray-600">
                    Get {reviewRewardAmount}% off your current bill
                    <br />
                    Example: £{reviewSavings} savings on a £{exampleBillAmount} bill
                  </p>
                  {rewardCode && (
                    <motion.div 
                      className="pt-3 border-t border-pink-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-gray-500 mb-1">Your Review Reward Code:</p>
                      <p className="text-lg font-mono font-bold text-primary">{rewardCode}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Card>
          </TabsContent>
          
          <TabsContent value="tip">
            <Card className="p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50">
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Tip Reward Details</p>
                  {tipAmount && tipRewardAmount ? (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        £{tipAmount.toFixed(2)} tip will be added to your bill
                      </p>
                      <p className="text-sm text-gray-600">
                        Earn £{tipRewardAmount.toFixed(2)} credit for your next visit
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No tip reward added yet</p>
                  )}
                  {tipRewardCode && (
                    <motion.div 
                      className="pt-3 border-t border-pink-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-sm text-gray-500 mb-1">Your Tip Reward Code:</p>
                      <p className="text-lg font-mono font-bold text-primary">{tipRewardCode}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Card>
          </TabsContent>
        </Tabs>

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