import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Star, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface RewardsSignupProps {
  email: string;
  onEmailChange: (email: string) => void;
  onJoinClick: () => void;
  tipAmount: number | null;
  rewardCode: string | null;
}

export const RewardsSignup = ({ 
  email, 
  onEmailChange, 
  onJoinClick,
  tipAmount,
  rewardCode 
}: RewardsSignupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="glass-card p-6 rounded-xl border border-gray-100"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Gift className="w-6 h-6 text-primary" />
        <h4 className="text-xl font-semibold text-gray-900">
          Join EatUP! Rewards
        </h4>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tipAmount && (
            <div className="flex items-start gap-3 p-3 bg-pink-50/50 rounded-lg">
              <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Tip Reward</p>
                <p className="text-sm text-gray-600">
                  £{(tipAmount * 0.5).toFixed(2)} credit from your £{tipAmount} tip
                </p>
              </div>
            </div>
          )}
          {rewardCode && (
            <div className="flex items-start gap-3 p-3 bg-pink-50/50 rounded-lg">
              <Gift className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Review Reward</p>
                <p className="text-sm text-gray-600">
                  Special reward for sharing your experience
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
          <p>Both rewards valid for 30 days</p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={onJoinClick}
              className="bg-primary hover:bg-primary-dark transition-colors whitespace-nowrap button-hover"
            >
              <Gift className="w-4 h-4 mr-2" />
              Join Now
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            You'll receive both rewards directly in your inbox
          </p>
        </div>
      </div>
    </motion.div>
  );
};