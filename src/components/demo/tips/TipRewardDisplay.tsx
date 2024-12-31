import { PartyPopper } from "lucide-react";

interface TipRewardDisplayProps {
  selectedTip: number;
}

export const TipRewardDisplay = ({ selectedTip }: TipRewardDisplayProps) => {
  const rewardAmount = selectedTip * 0.5;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-pink-100 shadow-sm text-center space-y-4 animate-fade-in">
      <div className="flex items-center justify-center gap-2">
        <PartyPopper className="w-5 h-5 text-primary" />
        <span className="text-xl font-semibold text-gray-900">
          Amazing Tip!
        </span>
      </div>
      <p className="text-gray-600">
        You've tipped £{selectedTip} and earned a £{rewardAmount.toFixed(2)} credit for your next visit!
      </p>
      <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
        <p className="text-sm text-gray-500 mb-2">Your Tip Reward Code:</p>
        <p className="text-lg font-mono font-bold text-primary">TIP{selectedTip}BACK</p>
        <p className="text-xs text-gray-500 mt-2">Valid for 30 days</p>
      </div>
    </div>
  );
};