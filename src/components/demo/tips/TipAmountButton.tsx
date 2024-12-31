import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";

interface TipAmountButtonProps {
  amount: number;
  rewardAmount: number;
  onClick: (amount: number) => void;
}

export const TipAmountButton = ({ amount, rewardAmount, onClick }: TipAmountButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-2"
    >
      <Button
        variant="outline"
        onClick={() => onClick(amount)}
        className="w-full h-16 bg-white/50 hover:bg-white/80 border border-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group"
      >
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-900">£{amount}</span>
          <Coins className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Button>
      <span className="text-xs font-medium text-primary animate-fade-in">
        Get £{rewardAmount.toFixed(2)} back
      </span>
    </motion.div>
  );
};