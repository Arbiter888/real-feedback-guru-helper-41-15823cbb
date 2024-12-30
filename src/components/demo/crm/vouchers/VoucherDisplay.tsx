import { Button } from "@/components/ui/button";
import { Gift, Pencil } from "lucide-react";

interface VoucherDisplayProps {
  suggestion: {
    title: string;
    description: string;
    validDays: number;
    discountValue: string;
  };
  onEdit?: () => void;
}

export const VoucherDisplay = ({ suggestion, onEdit }: VoucherDisplayProps) => {
  if (!suggestion) return null;

  return (
    <div className="bg-white/30 backdrop-blur-md border border-pink-100/50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Recommended Voucher</h4>
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-muted-foreground"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">{suggestion.title}</h3>
        <p className="text-gray-600">{suggestion.description}</p>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Valid for: {suggestion.validDays} days</p>
          <p>Discount: {suggestion.discountValue}</p>
        </div>
      </div>
    </div>
  );
};