import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, PartyPopper, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TipJarSectionProps {
  serverName: string | null;
  totalAmount?: number;
}

export const TipJarSection = ({ serverName, totalAmount }: TipJarSectionProps) => {
  const { toast } = useToast();
  
  if (!serverName) return null;

  const getSuggestedTips = (total: number) => {
    const tips = [5]; // Minimum £5 tip
    
    if (total) {
      // Add 10%, 15%, 20% of the bill, rounded to nearest pound
      const percentages = [0.10, 0.15, 0.20];
      percentages.forEach(percentage => {
        const suggestedTip = Math.max(5, Math.round(total * percentage));
        if (!tips.includes(suggestedTip)) {
          tips.push(suggestedTip);
        }
      });
    }
    
    return tips.sort((a, b) => a - b);
  };

  const handleTip = (amount: number) => {
    // For now, just show a toast - this would be connected to a payment system in production
    toast({
      title: `Tipping ${serverName}`,
      description: `£${amount} tip will be sent to ${serverName}`,
    });
  };

  const suggestedTips = getSuggestedTips(totalAmount || 0);

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-br from-white via-pink-50/30 to-white">
      {/* Top Section */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">
          Appreciate {serverName}'s service?
        </h3>
        <p className="text-sm text-primary font-medium">
          Tip today, get 50% back as credit for your next visit! 🎁
        </p>
      </div>

      {/* Tip Amount Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {suggestedTips.map((amount) => (
          <div key={amount} className="flex flex-col items-center gap-1">
            <Button
              variant="outline"
              className="w-full hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => handleTip(amount)}
            >
              £{amount}
            </Button>
            <span className="text-xs text-primary-dark font-medium">
              Get £{(amount * 0.5).toFixed(2)} back
            </span>
          </div>
        ))}
      </div>

      {/* Send Tip Button */}
      <Button 
        className="w-full bg-primary hover:bg-primary-dark transition-colors"
        onClick={() => handleTip(suggestedTips[1] || 5)}
      >
        <Heart className="w-4 h-4 mr-2" />
        Send Tip to {serverName}
      </Button>

      <p className="text-xs text-center text-gray-500">
        100% of tips go directly to your server
      </p>

      {/* Reward Section (shown after tipping) */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-pink-100 shadow-sm text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <PartyPopper className="w-5 h-5 text-primary" />
          <span className="text-xl font-semibold text-gray-900">
            Congratulations!
          </span>
        </div>
        <p className="text-gray-600">
          You've tipped £10 and earned a £5 credit for your next visit!
        </p>
        <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100">
          <p className="text-sm text-gray-500 mb-2">Your Reward Code:</p>
          <p className="text-lg font-mono font-bold text-primary">LOVE50</p>
          <p className="text-xs text-gray-500 mt-2">Valid for 30 days</p>
        </div>
      </div>

      {/* Sign-up Section */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-gray-900">
            Join Our EatUP! Rewards Program!
          </h4>
        </div>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Get your tip rewards, personalized vouchers, and exclusive weekly offers straight to your inbox
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button className="bg-primary hover:bg-primary-dark transition-colors">
            Join Now
          </Button>
        </div>
      </div>
    </Card>
  );
};