import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Clock } from "lucide-react";

interface VoucherSuggestionCardProps {
  suggestion: {
    type: string;
    description: string;
    reasoning: string;
    timing: string;
  };
  onUse: () => void;
}

export const VoucherSuggestionCard = ({ suggestion, onUse }: VoucherSuggestionCardProps) => {
  return (
    <Card className="p-4 bg-white/50 backdrop-blur-sm border border-pink-100/20">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-pink-500" />
            <h4 className="font-medium text-gray-900">{suggestion.type}</h4>
          </div>
          <Button onClick={onUse} variant="outline" size="sm">
            Use This Voucher
          </Button>
        </div>
        
        <p className="text-sm text-gray-600">{suggestion.description}</p>
        
        <div className="text-sm space-y-2">
          <div className="bg-pink-50 p-3 rounded-lg">
            <p className="font-medium text-pink-800">Why this voucher?</p>
            <p className="text-gray-600 mt-1">{suggestion.reasoning}</p>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Recommended timing: {suggestion.timing}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};