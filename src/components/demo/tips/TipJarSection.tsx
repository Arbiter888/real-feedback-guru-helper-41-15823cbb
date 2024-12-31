import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, PartyPopper, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface TipJarSectionProps {
  serverName: string | null;
  totalAmount?: number;
  rewardCode?: string | null;
}

export const TipJarSection = ({ serverName, totalAmount, rewardCode }: TipJarSectionProps) => {
  const { toast } = useToast();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [email, setEmail] = useState("");
  
  if (!serverName) return null;

  const getSuggestedTips = (total: number) => {
    const tips = [5]; // Minimum £5 tip
    
    if (total) {
      // Add 10%, 15%, 20% of the bill, rounded to nearest pound
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

  const handleTip = async (amount: number) => {
    setSelectedTip(amount);
    setShowReward(true);
    
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
      // Send email with both vouchers
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
      {/* Top Section */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">
          Appreciate {serverName}'s service?
        </h3>
        <p className="text-sm text-primary font-medium">
          Tip today, get 50% back as credit for your next visit! 🎁
        </p>
      </div>

      {/* Tip Amount Buttons */}
      {!showReward && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {suggestedTips.map((amount) => (
            <div key={amount} className="flex flex-col items-center gap-1">
              <Button
                variant="outline"
                className="w-full hover:bg-primary/5 hover:border-primary/30 transition-all"
                onClick={() => handleTip(amount)}
              >
                £{amount}
              </Button>
              <span className="text-xs text-primary-dark font-medium">
                Get £{(amount * 0.5).toFixed(2)} back
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Reward Section (shown after tipping) */}
      {showReward && selectedTip && (
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-pink-100 shadow-sm text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <PartyPopper className="w-5 h-5 text-primary" />
            <span className="text-xl font-semibold text-gray-900">
              Congratulations!
            </span>
          </div>
          <p className="text-gray-600">
            You've tipped £{selectedTip} and earned a £{(selectedTip * 0.5).toFixed(2)} credit for your next visit!
          </p>
          <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
            <p className="text-sm text-gray-500 mb-2">Your Tip Reward Code:</p>
            <p className="text-lg font-mono font-bold text-primary">TIP{selectedTip}BACK</p>
            <p className="text-xs text-gray-500 mt-2">Valid for 30 days</p>
          </div>
        </div>
      )}

      {/* Unified Sign-up Section */}
      {(showReward || rewardCode) && (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-semibold text-gray-900">
              Join Our EatUP! Rewards Program!
            </h4>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Get your rewards sent straight to your inbox:
              {showReward && (
                <span className="block font-medium text-primary">
                  • £{(selectedTip! * 0.5).toFixed(2)} tip reward credit
                </span>
              )}
              {rewardCode && (
                <span className="block font-medium text-primary">
                  • Special review completion reward
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleJoinRewards}
                className="bg-primary hover:bg-primary-dark transition-colors"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};