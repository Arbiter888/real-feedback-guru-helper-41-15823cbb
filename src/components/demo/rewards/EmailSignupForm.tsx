import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Mail, Loader2, Check } from "lucide-react";

interface EmailSignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  totalRewardValue: number;
}

export const EmailSignupForm = ({ 
  email, 
  setEmail, 
  onSubmit, 
  isLoading,
  totalRewardValue
}: EmailSignupFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-pink-50/50 p-6 rounded-xl border border-pink-100">
        <div className="flex items-center justify-center gap-3">
          <Gift className="h-8 w-8 text-primary" />
          <h3 className="font-bold text-2xl bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] text-transparent bg-clip-text">
            Join EatUP! Rewards
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Get instant access to £{totalRewardValue.toFixed(2)} in rewards plus exclusive weekly offers
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="h-5 w-5 text-primary" />
              <span>Get instant access to your rewards</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="h-5 w-5 text-primary" />
              <span>Exclusive weekly offers and promotions</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="h-5 w-5 text-primary" />
              <span>Early access to special events</span>
            </li>
          </ul>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email to receive rewards"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <Button 
              onClick={onSubmit}
              disabled={isLoading || !email}
              className="w-full h-12 bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Gift className="h-5 w-5 mr-2" />
                  <span>Get Your Rewards</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};