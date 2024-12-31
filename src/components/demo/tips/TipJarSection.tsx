import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TipAmountButton } from "./TipAmountButton";
import { TipRewardDisplay } from "./TipRewardDisplay";
import { RewardsSignup } from "./RewardsSignup";

interface TipJarSectionProps {
  serverName: string | null;
  totalAmount?: number;
  rewardCode?: string | null;
}

export const TipJarSection = ({ serverName, totalAmount, rewardCode }: TipJarSectionProps) => {
  const { toast } = useToast();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  
  if (!serverName) return null;

  const getSuggestedTips = (total: number) => {
    const tips = [5];
    if (total) {
      const percentages = [0.10, 0.15, 0.20];
      percentages.forEach(percentage => {
        const suggestedTip = Math.max(5, Math.round(total * percentage));
        if (!tips.includes(suggestedTip)) {
          tips.push(suggestedTip);
        }
      });
    }
    return tips.sort((a, b) => a - b);
  };

  const handleTip = (amount: number) => {
    setSelectedTip(amount);
    toast({
      title: `Thank you for tipping ${serverName}!`,
      description: `Your £${amount} tip will be processed and you'll receive £${(amount * 0.5).toFixed(2)} back as credit.`,
    });
  };

  const handleJoinRewards = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email to join the rewards program.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/send-rewards-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tipAmount: selectedTip,
          tipReward: selectedTip ? selectedTip * 0.5 : 0,
          reviewRewardCode: rewardCode,
          serverName,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast({
        title: "Welcome to EatUP! Rewards!",
        description: "Check your email for your reward vouchers.",
      });
      
      setEmail("");
    } catch (error) {
      console.error("Error joining rewards:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const suggestedTips = getSuggestedTips(totalAmount || 0);

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-white via-pink-50/30 to-white">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-semibold text-gray-900">
          Appreciate {serverName}'s service?
        </h3>
        <p className="text-sm text-primary font-medium">
          Tip today, get 50% back as credit for your next visit! 🎁
        </p>
      </div>

      {/* Tip Amount Buttons */}
      {!selectedTip && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {suggestedTips.map((amount) => (
            <TipAmountButton
              key={amount}
              amount={amount}
              rewardAmount={amount * 0.5}
              onClick={handleTip}
            />
          ))}
        </div>
      )}

      {/* Reward Display */}
      {selectedTip && <TipRewardDisplay selectedTip={selectedTip} />}

      {/* Unified Signup Section */}
      {(selectedTip || rewardCode) && (
        <RewardsSignup
          email={email}
          onEmailChange={setEmail}
          onJoinClick={handleJoinRewards}
          tipAmount={selectedTip}
          rewardCode={rewardCode}
        />
      )}
    </Card>
  );
};