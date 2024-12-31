import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TipAmountButtonProps {
  amount: number;
  rewardAmount: number;
  onClick: (amount: number) => void;
}

export const TipAmountButton = ({ amount, rewardAmount, onClick }: TipAmountButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-1"
    >
      <Button
        variant="outline"
        className="w-full hover:bg-primary/5 hover:border-primary/30 transition-all button-hover"
        onClick={() => onClick(amount)}
      >
        £{amount}
      </Button>
      <span className="text-xs text-primary font-medium">
        Get £{rewardAmount.toFixed(2)} back
      </span>
    </motion.div>
  );
};