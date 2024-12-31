import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Mail } from "lucide-react";
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
      className="glass-card p-6 rounded-xl border border-gray-100 bg-white/50"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Gift className="w-6 h-6 text-primary" />
          <h4 className="text-xl font-semibold text-gray-900">
            Join EatUP! Rewards
          </h4>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email to receive rewards"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="pl-10"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <Button 
            onClick={onJoinClick}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-[1.02]"
          >
            <Gift className="h-5 w-5" />
            <span>Get Your Rewards</span>
          </Button>

          <p className="text-xs text-center text-gray-500">
            Both rewards valid for 30 days from issue
          </p>
        </div>
      </div>
    </motion.div>
  );
};