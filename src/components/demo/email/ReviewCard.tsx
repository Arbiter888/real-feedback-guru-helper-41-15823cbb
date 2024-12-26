import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Mail, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReceiptAnalysisDisplay } from "../ReceiptAnalysisDisplay";

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
    refined_review?: string;
  };
  onGenerateFollowUp: (reviewId: string) => void;
  isGenerating: boolean;
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
      <div className="space-y-6">
        {/* Header with timestamp and server info */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Received {timeAgo}</p>
          {review.server_name && (
            <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Server: {review.server_name}
            </span>
          )}
        </div>

        {/* Initial Review Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Initial Thoughts</h4>
          <div className="bg-secondary/5 rounded-lg p-4">
            <p className="text-sm">{review.review_text}</p>
          </div>
        </div>

        {/* AI Enhanced Review Section */}
        {review.refined_review && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">AI Enhanced Review</h4>
            <div className="bg-primary/5 rounded-lg p-4">
              <p className="text-sm">{review.refined_review}</p>
            </div>
          </div>
        )}

        {/* Receipt Analysis Section */}
        {review.receipt_data && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Receipt Details</h4>
            <ReceiptAnalysisDisplay analysisResult={review.receipt_data} />
          </div>
        )}

        {/* Action Buttons */}
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
            className="bg-[#E94E87] hover:bg-[#E94E87]/90 text-white"
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