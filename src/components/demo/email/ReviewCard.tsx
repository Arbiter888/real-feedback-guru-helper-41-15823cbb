import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Mail, Loader2, MessageSquare, Receipt, Bot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface ReviewCardProps {
  review: {
    id: string;
    review_text: string;
    refined_review?: string;
    created_at: string;
    server_name?: string;
    receipt_data?: {
      total_amount: number;
      items: Array<{ name: string; price: number }>;
    };
  };
  onGenerateFollowUp: (reviewId: string) => void;
  isGenerating: boolean;
  selectedReviewId: string | null;
  onTogglePreview: () => void;
  showPreview: boolean;
}

export const ReviewCard = ({
  review,
  onGenerateFollowUp,
  isGenerating,
  onTogglePreview,
  showPreview,
}: ReviewCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Received {timeAgo}</p>
              {review.server_name && (
                <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Server: {review.server_name}
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full justify-between"
        >
          <span>Review Details</span>
          {showDetails ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>

        {showDetails && (
          <div className="space-y-4">
            {/* Step 1: Initial Thoughts */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Step 1: Initial Thoughts</h4>
              </div>
              <p className="text-sm">{review.review_text}</p>
            </div>

            {/* Step 2: Receipt Analysis */}
            {review.receipt_data && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Step 2: Receipt Analysis</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Total Amount: {formatCurrency(review.receipt_data.total_amount)}
                  </p>
                  <div className="space-y-1">
                    {review.receipt_data.items.map((item, index) => (
                      <div key={index} className="text-sm flex justify-between">
                        <span>{item.name}</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Enhanced Review */}
            {review.refined_review && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Step 3: Enhanced Review</h4>
                </div>
                <p className="text-sm">{review.refined_review}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
          >
            {showPreview ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Email
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Email
              </>
            )}
          </Button>

          <Button
            onClick={() => onGenerateFollowUp(review.id)}
            disabled={isGenerating}
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Generate Follow-up
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};