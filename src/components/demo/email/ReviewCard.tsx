import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Mail, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: {
    id: string;
    review_text: string;
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
  const timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });

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
            <p className="text-sm">{review.review_text}</p>
          </div>
        </div>

        {review.receipt_data && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium">Receipt Details</h4>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Total Amount: ${review.receipt_data.total_amount}
              </p>
              <div className="text-sm text-muted-foreground">
                {review.receipt_data.items.length} items ordered
              </div>
            </div>
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