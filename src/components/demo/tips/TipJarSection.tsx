import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TipAmountButton } from "./TipAmountButton";
import { TipRewardDisplay } from "./TipRewardDisplay";
import { RewardsSignup } from "./RewardsSignup";
import { TipJarHeader } from "./TipJarHeader";
import { motion, AnimatePresence } from "framer-motion";

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

  const suggestedTips = getSuggestedTips(totalAmount || 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <Card className="overflow-hidden bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-lg border border-white/20 shadow-xl">
        <div className="p-6">
          <TipJarHeader serverName={serverName} />
        </div>
      </Card>

      {/* Tip Selection Grid */}
      <AnimatePresence mode="wait">
        {!selectedTip ? (
          <motion.div
            key="tip-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-white/70 via-white/80 to-white/70 backdrop-blur-lg border border-white/20 shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {suggestedTips.map((amount) => (
                  <TipAmountButton
                    key={amount}
                    amount={amount}
                    rewardAmount={amount * 0.5}
                    onClick={handleTip}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="rewards-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Combined Rewards Card */}
            <TipRewardDisplay 
              selectedTip={selectedTip}
              rewardCode={rewardCode}
            />

            {/* Single Signup Section */}
            <RewardsSignup
              email={email}
              onEmailChange={setEmail}
              onJoinClick={() => {
                if (!email) {
                  toast({
                    title: "Email required",
                    description: "Please enter your email to join the rewards program.",
                    variant: "destructive",
                  });
                  return;
                }
                toast({
                  title: "Welcome to EatUP! Rewards!",
                  description: "Check your email for your reward vouchers.",
                });
                setEmail("");
              }}
              tipAmount={selectedTip}
              rewardCode={rewardCode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};