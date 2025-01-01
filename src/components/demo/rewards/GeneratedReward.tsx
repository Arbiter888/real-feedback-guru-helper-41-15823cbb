import { Gift, Star } from "lucide-react";
import { motion } from "framer-motion";
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

      {/* Email Signup */}
      <Card className="p-6">
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