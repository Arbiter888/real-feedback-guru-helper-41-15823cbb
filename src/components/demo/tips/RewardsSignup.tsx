import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface RewardsSignupProps {
  email: string;
  onEmailChange: (email: string) => void;
  onJoinClick: () => void;
  tipAmount: number | null;
  rewardCode: string | null;
  isLoading?: boolean;
}

export const RewardsSignup = ({ 
  email, 
  onEmailChange, 
  onJoinClick,
  tipAmount,
  rewardCode,
  isLoading = false
}: RewardsSignupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="glass-card p-8 rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm"
    >
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <motion.div 
            className="flex items-center justify-center gap-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Gift className="w-8 h-8 text-primary animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-900">
              Join EatUP! Rewards
            </h3>
          </motion.div>
          
          <motion.ul 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-primary" />
              <span>Get instant access to your rewards</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-primary" />
              <span>Exclusive weekly offers and promotions</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-5 h-5 text-primary" />
              <span>Early access to special events</span>
            </li>
          </motion.ul>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email to receive rewards"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="pl-10 h-12 text-lg transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <Button 
            onClick={onJoinClick}
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-semibold 
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
                <span>Get Your Rewards</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-sm text-center text-gray-500">
            Both rewards valid for 30 days from issue
          </p>
        </div>
      </div>
    </motion.div>
  );
};