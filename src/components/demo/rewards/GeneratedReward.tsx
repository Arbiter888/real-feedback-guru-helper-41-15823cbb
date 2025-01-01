import { EmailSignup } from "./EmailSignup";

interface GeneratedRewardProps {
  rewardCode: string | null;
  reviewRewardAmount?: number;
}

export const GeneratedReward = ({ 
  rewardCode,
  reviewRewardAmount = 10
}: GeneratedRewardProps) => {
  if (!rewardCode) return null;

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">
          🎉 Your £{reviewRewardAmount} Review Reward Code
        </h3>
        <p className="text-2xl font-mono font-bold text-primary mb-4">
          {rewardCode}
        </p>
        <p className="text-sm text-gray-600">
          Sign up below to receive your reward code via email.
        </p>
      </div>
      <EmailSignup 
        rewardCode={rewardCode} 
        reviewRewardAmount={reviewRewardAmount}
      />
    </div>
  );
};