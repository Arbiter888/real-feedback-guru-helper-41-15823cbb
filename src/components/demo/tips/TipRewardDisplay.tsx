import { PartyPopper, Star } from "lucide-react";
import { motion } from "framer-motion";

interface TipRewardDisplayProps {
  selectedTip: number;
  rewardCode?: string | null;
}

export const TipRewardDisplay = ({ selectedTip, rewardCode }: TipRewardDisplayProps) => {
  const rewardAmount = selectedTip * 0.5;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-xl space-y-4 animate-fade-in"
    >
      <div className="flex items-center justify-center gap-2">
        <PartyPopper className="w-5 h-5 text-primary" />
        <span className="text-xl font-semibold text-gray-900">
          Amazing Tip!
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Tip Reward</p>
              <p className="text-sm text-gray-600">
                £{rewardAmount.toFixed(2)} credit from your £{selectedTip} tip
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-pink-100">
            <p className="text-sm text-gray-500 mb-1">Your Tip Reward Code:</p>
            <p className="text-lg font-mono font-bold text-primary">TIP{selectedTip}BACK</p>
          </div>
        </div>

        {rewardCode && (
          <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Review Reward</p>
                <p className="text-sm text-gray-600">
                  Special reward for sharing your experience
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-pink-100">
              <p className="text-sm text-gray-500 mb-1">Your Review Reward Code:</p>
              <p className="text-lg font-mono font-bold text-primary">{rewardCode}</p>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-center text-gray-500">
        Both rewards valid for 30 days
      </p>
    </motion.div>
  );
};