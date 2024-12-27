import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface TipJarSectionProps {
  serverName: string | null;
  totalAmount?: number;
}

export const TipJarSection = ({ serverName, totalAmount }: TipJarSectionProps) => {
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

  const suggestedTips = getSuggestedTips(totalAmount || 0);

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Appreciate {serverName}'s service?
        </h3>
        <p className="text-sm text-gray-600">
          Show your gratitude with a tip!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {suggestedTips.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            className="w-full"
            onClick={() => {
              // Placeholder for future payment integration
              console.log(`Selected tip amount: £${amount}`);
            }}
          >
            £{amount}
          </Button>
        ))}
      </div>

      <Button 
        className="w-full"
        onClick={() => {
          // Placeholder for future payment integration
          console.log('Custom tip amount clicked');
        }}
      >
        <Heart className="w-4 h-4 mr-2" />
        Send Tip to {serverName}
      </Button>

      <p className="text-xs text-center text-gray-500">
        100% of tips go directly to your server
      </p>
    </Card>
  );
};