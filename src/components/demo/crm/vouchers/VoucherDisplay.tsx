import { Card } from "@/components/ui/card";
import { Gift } from "lucide-react";

interface VoucherDisplayProps {
  suggestion: {
    title: string;
    description: string;
    validDays: number;
    discountValue: string;
  };
}

export const VoucherDisplay = ({ suggestion }: VoucherDisplayProps) => {
  if (!suggestion) return null;

  return (
    <Card className="bg-gradient-to-br from-white/90 via-pink-50/80 to-white/90 backdrop-blur-lg border border-pink-100/50 shadow-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary" />
        <h4 className="font-medium text-lg">{suggestion.title}</h4>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-semibold text-primary">{suggestion.discountValue}</p>
        <p className="text-sm text-gray-600">{suggestion.description}</p>
        <p className="text-sm text-gray-600">Valid for: {suggestion.validDays} days</p>
      </div>
    </Card>
  );
};