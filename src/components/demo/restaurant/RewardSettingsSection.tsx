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
        <Label htmlFor="reviewRewardAmount">Review Reward Amount (£)</Label>
        <Input
          id="reviewRewardAmount"
          type="number"
          min="0"
          step="0.01"
          value={reviewRewardAmount}
          onChange={(e) => onInfoChange('reviewRewardAmount', parseFloat(e.target.value))}
          placeholder="Enter review reward amount"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipRewardPercentage">Tip Reward Percentage (%)</Label>
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
      </div>
    </div>
  );
};