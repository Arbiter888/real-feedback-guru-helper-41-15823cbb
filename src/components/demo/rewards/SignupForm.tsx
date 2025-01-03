import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Gift, Mail, Lock, Loader2, Star } from "lucide-react";

interface SignupFormProps {
  firstName: string;
  email: string;
  isLoading: boolean;
  setFirstName: (name: string) => void;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  tipRewardAmount?: number;
  tipRewardCode?: string;
}

export const SignupForm = ({
  firstName,
  email,
  isLoading,
  setFirstName,
  setEmail,
  onSubmit,
  tipRewardAmount,
  tipRewardCode
}: SignupFormProps) => {
  return (
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
            <li className="flex items-center gap-2 text-gray-700 pt-2 border-t border-pink-100">
              <Star className="w-5 h-5 text-primary" />
              <div className="space-y-1">
                <span className="block font-medium">Share & earn more rewards!</span>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p>• Get your personal referral code</p>
                  <p>• Earn stars for friend referrals</p>
                  <p className="flex items-center gap-1">
                    • Collect stars for special rewards
                    <span className="inline-flex ml-1">
                      <Star className="w-4 h-4 text-primary" fill="currentColor" />
                      <Star className="w-4 h-4 text-gray-300" />
                      <Star className="w-4 h-4 text-gray-300" />
                    </span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-10 h-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email to unlock rewards"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <button 
            onClick={onSubmit}
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
  );
};