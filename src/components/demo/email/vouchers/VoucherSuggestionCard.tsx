import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ThumbsUp, ThumbsDown, Heart, Meh } from "lucide-react";

interface VoucherSuggestionCardProps {
  suggestion: {
    title: string;
    description: string;
    timing: string;
    reasoning?: string;
    category: 'highly_positive' | 'positive' | 'neutral' | 'negative';
  };
  onUse: () => void;
}

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'highly_positive':
      return {
        icon: ThumbsUp,
        bgColor: 'bg-green-50/50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      };
    case 'positive':
      return {
        icon: Heart,
        bgColor: 'bg-pink-50/50',
        borderColor: 'border-pink-200',
        textColor: 'text-pink-800'
      };
    case 'neutral':
      return {
        icon: Meh,
        bgColor: 'bg-yellow-50/50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      };
    case 'negative':
      return {
        icon: ThumbsDown,
        bgColor: 'bg-red-50/50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      };
    default:
      return {
        icon: Heart,
        bgColor: 'bg-blue-50/50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      };
  };
};

export const VoucherSuggestionCard = ({ suggestion, onUse }: VoucherSuggestionCardProps) => {
  const style = getCategoryStyle(suggestion.category);
  const CategoryIcon = style.icon;

  return (
    <Card className={`p-4 ${style.bgColor} border ${style.borderColor}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CategoryIcon className={`h-5 w-5 ${style.textColor}`} />
              <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{suggestion.description}</p>
            {suggestion.reasoning && (
              <div className="mt-2 text-sm text-gray-500 italic">
                <span className="font-medium">Why this voucher? </span>
                {suggestion.reasoning}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Recommended timing: {suggestion.timing}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onUse}
            className={style.textColor}
          >
            Use Suggestion
          </Button>
        </div>
      </div>
    </Card>
  );
};