import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Mail, Check, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ReferralSignupForm } from "./ReferralSignupForm";

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
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async () => {
    if (!firstName || !email) {
      toast({
        title: "Required fields missing",
        description: "Please enter both your first name and email address to sign up.",
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
          firstName,
          email,
          tipAmount,
          tipReward: tipRewardAmount,
          tipRewardCode,
          reviewRewardCode: rewardCode,
          restaurantInfo: reviewInfo?.restaurantInfo
        }
      });

      if (emailError) throw emailError;

      setIsSignedUp(true);
      toast({
        title: "Welcome to EatUP!",
        description: "Your rewards have been sent to your email!",
      });
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
      {!isSignedUp ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold text-gray-900">
              Join EatUP! Rewards
            </h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white/80 p-4 rounded-lg border border-pink-100">
              <h4 className="font-medium text-lg mb-2">Unlock Your Rewards:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <Lock className="w-5 h-5 text-primary" />
                  <span>10% off today's bill</span>
                  <span className="text-sm text-primary ml-1">(Unlock now)</span>
                </li>
                {tipRewardAmount && tipRewardCode && (
                  <li className="flex items-center gap-2 text-gray-700">
                    <Lock className="w-5 h-5 text-primary" />
                    <span>£{tipRewardAmount.toFixed(2)} tip credit next time</span>
                  </li>
                )}
                <li className="flex items-center gap-2 text-gray-700">
                  <Lock className="w-5 h-5 text-primary" />
                  <span>Mystery reward for your next visit</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email to unlock rewards"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 h-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <button 
                onClick={handleEmailSignup}
                disabled={isLoading || !email || !firstName}
                className="w-full h-12 bg-pink-300 hover:bg-pink-400 text-white rounded-xl text-lg font-semibold 
                         flex items-center justify-center gap-2 transform transition-all duration-300 
                         hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Gift className="h-5 w-5" />
                    <span>Unlock Your Rewards</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Check className="h-8 w-8 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              Show this to your server
            </h3>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Take 10% off your current bill</span>
              </li>
              {tipAmount && (
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Add £{tipAmount.toFixed(2)} tip to the final amount</span>
                </li>
              )}
            </ul>
          </div>

          <p className="text-sm text-center text-gray-500">
            Valid for today only
          </p>

          <div className="pt-6 border-t border-gray-200">
            <ReferralSignupForm
              reviewId={null}
              restaurantName={localStorage.getItem('restaurantInfo') ? JSON.parse(localStorage.getItem('restaurantInfo')!).restaurantName : 'Restaurant'}
              reviewText=""
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};