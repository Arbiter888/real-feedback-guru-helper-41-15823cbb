import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RewardSettingsSectionProps {
  reviewRewardAmount: number;
  tipRewardPercentage: number;
  onInfoChange: (field: string, value: number) => void;
}

export const RewardSettingsSection = ({
  reviewRewardAmount,
  tipRewardPercentage,
  onInfoChange,
}: RewardSettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reviewRewardAmount">Review Reward (% off current bill)</Label>
        <Input
          id="reviewRewardAmount"
          type="number"
          min="0"
          max="100"
          step="1"
          value={reviewRewardAmount}
          onChange={(e) => onInfoChange('reviewRewardAmount', parseFloat(e.target.value))}
          placeholder="Enter review reward percentage"
        />
        <p className="text-sm text-muted-foreground">
          Percentage discount applied to their current bill
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipRewardPercentage">Tip Reward (% credit)</Label>
        <Input
          id="tipRewardPercentage"
          type="number"
          min="0"
          max="100"
          step="1"
          value={tipRewardPercentage}
          onChange={(e) => onInfoChange('tipRewardPercentage', parseFloat(e.target.value))}
          placeholder="Enter tip reward percentage"
        />
        <p className="text-sm text-muted-foreground">
          Percentage of tip given as credit on next visit
        </p>
      </div>
    </div>
  );
};