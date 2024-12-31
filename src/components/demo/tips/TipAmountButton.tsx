import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coins, Check } from "lucide-react";

interface TipAmountButtonProps {
  amount: number;
  rewardAmount: number;
  onClick: (amount: number) => void;
  isSelected?: boolean;
}

export const TipAmountButton = ({ amount, rewardAmount, onClick, isSelected }: TipAmountButtonProps) => {
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
        className={`
          w-full h-16 relative
          bg-white/50 hover:bg-white/80 
          border border-white/20 backdrop-blur-sm rounded-xl 
          transition-all duration-300 hover:scale-105 hover:shadow-lg 
          group
          ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
        `}
      >
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-gray-900">£{amount}</span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isSelected ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-2 top-2"
          >
            <Check className="w-4 h-4 text-primary" />
          </motion.div>
          <Coins className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Button>
      <motion.span 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-sm font-medium text-primary"
      >
        Get £{rewardAmount.toFixed(2)} back
      </motion.span>
    </motion.div>
  );
};