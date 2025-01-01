import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Mail, Check, Lock, Loader2 } from "lucide-react";
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
        description: "Your rewards have been sent to your email!",
      });

      setEmail("");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send rewards. Please try again.",
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
          <Gift className="h-8 w-8 text-primary" />
          <h3 className="text-xl font-semibold text-gray-900">
            Join EatUP! Rewards
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 p-4 rounded-lg border border-pink-100">
            <h4 className="font-medium text-lg mb-2">Your Rewards Summary:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>10% off today's bill</span>
                <span className="text-sm text-green-600 ml-1">(Available now)</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span>Mystery reward for your next visit</span>
              </li>
              {tipRewardAmount && tipRewardCode && (
                <li className="flex items-center gap-2 text-gray-500">
                  <Lock className="w-5 h-5" />
                  <span>£{tipRewardAmount.toFixed(2)} tip credit next time</span>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Plus, unlock access to:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span>Exclusive weekly offers</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span>Early access to events</span>
              </li>
              <li className="flex items-center gap-2 text-gray-500">
                <Lock className="w-5 h-5" />
                <span>Birthday treats and surprises</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email to unlock rewards"
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
                <span>Unlock Your Rewards</span>
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-center text-gray-500">
          All rewards valid for 30 days from issue
        </p>
      </div>
    </motion.div>
  );
};