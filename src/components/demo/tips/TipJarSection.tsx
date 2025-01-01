import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TipAmountButton } from "./TipAmountButton";
import { TipRewardDisplay } from "./TipRewardDisplay";
import { RewardsSignup } from "./RewardsSignup";
import { TipJarHeader } from "./TipJarHeader";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface TipJarSectionProps {
  serverName: string | null;
  totalAmount?: number;
  rewardCode?: string | null;
  tipRewardPercentage?: number;
  reviewRewardAmount?: number;
}

export const TipJarSection = ({ 
  serverName, 
  totalAmount, 
  rewardCode,
  tipRewardPercentage = 50,
  reviewRewardAmount = 10
}: TipJarSectionProps) => {
  const { toast } = useToast();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
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
    const rewardAmount = (amount * (tipRewardPercentage / 100)).toFixed(2);
    toast({
      title: `Thank you for tipping ${serverName}!`,
      description: `Your £${amount} tip will be processed and you'll receive £${rewardAmount} back as credit.`,
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

    if (!selectedTip && !rewardCode) {
      toast({
        title: "No rewards selected",
        description: "Please select a tip amount or complete your review first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Get restaurant info from localStorage if available
      const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
      const restaurantInfo = savedRestaurantInfo ? JSON.parse(savedRestaurantInfo) : {};

      // Send welcome email with rewards
      const { error: emailError } = await supabase.functions.invoke('send-rewards-email', {
        body: {
          email,
          tipAmount: selectedTip,
          tipReward: selectedTip ? selectedTip * 0.5 : 0,
          reviewRewardCode: rewardCode,
          serverName,
          restaurantInfo
        }
      });

      if (emailError) throw emailError;

      // Save tip voucher if applicable
      if (selectedTip) {
        const { error: voucherError } = await supabase
          .from('tip_vouchers')
          .insert({
            tip_amount: selectedTip,
            voucher_amount: selectedTip * 0.5,
            voucher_code: `TIP${selectedTip}BACK`,
            customer_email: email,
            server_name: serverName,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (voucherError) throw voucherError;
      }
      
      toast({
        title: "Welcome to EatUP! Rewards!",
        description: "Check your email for your reward vouchers.",
      });
      setEmail("");
    } catch (error) {
      console.error('Error processing rewards:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestedTips = getSuggestedTips(totalAmount || 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-lg border border-white/20 shadow-xl">
        <div className="p-6">
          <TipJarHeader serverName={serverName} />
        </div>
      </Card>

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
                    rewardAmount={amount * (tipRewardPercentage / 100)}
                    onClick={handleTip}
                    isSelected={selectedTip === amount}
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
            <TipRewardDisplay 
              selectedTip={selectedTip}
              rewardCode={rewardCode}
              tipRewardPercentage={tipRewardPercentage}
              reviewRewardAmount={reviewRewardAmount}
            />

            <RewardsSignup
              email={email}
              onEmailChange={setEmail}
              onJoinClick={handleJoinRewards}
              tipAmount={selectedTip}
              rewardCode={rewardCode}
              isLoading={isProcessing}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};