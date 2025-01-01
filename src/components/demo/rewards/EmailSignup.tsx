import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Mail, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface EmailSignupProps {
  rewardCode: string | null;
  tipAmount?: number;
  tipRewardCode?: string;
  tipRewardAmount?: number;
  totalRewardValue: number;
}

export const EmailSignup = ({ 
  rewardCode,
  tipAmount,
  tipRewardCode,
  tipRewardAmount,
  totalRewardValue
}: EmailSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to sign up.",
        variant: "destructive",
      });
      return;
    }

    if (!rewardCode && !tipRewardCode) {
      toast({
        title: "No rewards available",
        description: "Please complete your review or add a tip to receive rewards.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const reviewDataString = localStorage.getItem('reviewData');
      console.log('Raw review data:', reviewDataString);

      if (!reviewDataString && rewardCode) {
        throw new Error('No review data found');
      }

      let reviewInfo = null;
      if (reviewDataString) {
        reviewInfo = JSON.parse(reviewDataString);
        console.log('Parsed review info:', reviewInfo);
      }

      const { data: listData, error: listError } = await supabase
        .rpc('get_or_create_restaurant_email_list', {
          restaurant_name: reviewInfo?.restaurantName || "The Local Kitchen & Bar"
        });

      if (listError) throw listError;

      const { error: emailError } = await supabase.functions.invoke('send-rewards-email', {
        body: {
          email,
          tipAmount,
          tipReward: tipRewardAmount,
          tipRewardCode,
          reviewRewardCode: rewardCode,
          restaurantInfo: reviewInfo?.restaurantInfo
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Success!",
        description: "Thank you for signing up! Check your email for your rewards.",
      });

      setEmail("");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6 p-6 bg-gradient-to-br from-pink-50/50 via-white to-pink-50/50 rounded-xl border border-pink-100"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3">
          <Gift className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold text-gray-900">
            Join EatUP! Rewards
          </h3>
        </div>

        <motion.ul 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <li className="flex items-center gap-2 text-gray-700">
            <Check className="w-5 h-5 text-primary" />
            <span>Get your £{totalRewardValue.toFixed(2)} tip credit voucher sent instantly to your email</span>
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <Check className="w-5 h-5 text-primary" />
            <span>Redeem your tip credit on your next visit</span>
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <Check className="w-5 h-5 text-primary" />
            <span>Receive exclusive, personalized offers from the restaurant</span>
          </li>
        </motion.ul>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email to get your tip credit voucher"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <Button 
            onClick={handleEmailSignup}
            disabled={isLoading || !email}
            className="w-full h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Gift className="h-5 w-5 mr-2" />
                <span>Get Your Tip Credit Voucher</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};