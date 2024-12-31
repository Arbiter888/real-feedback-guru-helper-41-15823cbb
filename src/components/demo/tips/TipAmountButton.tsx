import { Button } from "@/components/ui/button";

interface TipAmountButtonProps {
  amount: number;
  rewardAmount: number;
  onClick: (amount: number) => void;
}

export const TipAmountButton = ({ amount, rewardAmount, onClick }: TipAmountButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="outline"
        className="w-full hover:bg-primary/5 hover:border-primary/30 transition-all"
        onClick={() => onClick(amount)}
      >
        £{amount}
      </Button>
      <span className="text-xs text-primary-dark font-medium">
        Get £{rewardAmount.toFixed(2)} back
      </span>
    </div>
  );
};