import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Info, 
  Clock,
  Gift,
  ArrowRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistance } from "date-fns";

interface EnhancedRewardDisplayProps {
  discountPercentage: number;
  creditAmount: number;
  tipAmount?: number;
  totalReward: number;
  onClaimRewards: (email: string) => void;
  expiresAt?: Date;
}

export const EnhancedRewardDisplay = ({
  discountPercentage,
  creditAmount,
  tipAmount,
  totalReward,
  onClaimRewards,
  expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now by default
}: EnhancedRewardDisplayProps) => {
  const [email, setEmail] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = () => {
    onClaimRewards(email);
    setIsConfirmed(true);
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Main Headline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Get {discountPercentage}% Off Today's Bill and Earn £{creditAmount.toFixed(2)} Credit!
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Your rewards include:</p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>{discountPercentage}% off your current bill</li>
                  <li>£{creditAmount.toFixed(2)} credit for your next visit</li>
                  <li>Access to exclusive weekly offers</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Expiration Timer */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Expires {formatDistance(expiresAt, new Date(), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Server Instructions */}
      <div className="bg-pink-50/50 rounded-lg p-4 border border-pink-100">
        <h3 className="font-medium mb-2">Show this to your server:</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Receive {discountPercentage}% off your current bill</span>
          </li>
          {tipAmount && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>A £{tipAmount.toFixed(2)} tip will be added to your bill</span>
            </li>
          )}
        </ul>
      </div>

      {/* Call-to-Action Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Ready to Claim Your Credit?
            {isConfirmed && <Check className="h-5 w-5 text-green-500" />}
          </h3>
          <p className="text-muted-foreground">
            Confirm your £{creditAmount.toFixed(2)} credit and join EatUP! Rewards
          </p>
        </div>

        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4" />
              Get instant confirmation of your credit
            </li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="h-4 w-4" />
              Save £{discountPercentage}% today plus get £{creditAmount.toFixed(2)} for your next visit
            </li>
          </ul>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
              disabled={!email || isConfirmed}
            >
              {isConfirmed ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmed!
                </>
              ) : (
                <>
                  Get My Credit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};