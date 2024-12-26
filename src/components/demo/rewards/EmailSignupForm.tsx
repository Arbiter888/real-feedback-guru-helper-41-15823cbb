import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Mail, Loader2 } from "lucide-react";
import { useState } from "react";

interface EmailSignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const EmailSignupForm = ({ 
  email, 
  setEmail, 
  onSubmit, 
  isLoading 
}: EmailSignupFormProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-3">
        <Gift className="h-8 w-8 text-[#E94E87]" />
        <h3 className="font-bold text-2xl bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] text-transparent bg-clip-text">
          Join Our Mailing List! 🎁
        </h3>
      </div>

      <div className="space-y-6">
        <p className="text-center text-gray-600 text-lg">
          Sign up to our mailing list and EatUP! rewards to receive exclusive offers and updates
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <Button 
            onClick={onSubmit}
            disabled={isLoading || !email}
            className="w-full h-12 px-8 bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] hover:opacity-90 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing up...</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>Sign Up to Our Mailing List</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};