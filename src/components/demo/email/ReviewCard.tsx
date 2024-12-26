import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Mail, Loader2, MessageSquare, Receipt, Bot } from "lucide-react";
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

        {/* Initial Thoughts Section */}
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Initial Thoughts</h4>
          </div>
          <p className="text-sm text-gray-600">{review.review_text}</p>
        </div>

        {/* Receipt Analysis Section */}
        {review.receipt_data && (
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Receipt Details</h4>
            </div>
            <ReceiptAnalysisDisplay analysisResult={review.receipt_data} />
          </div>
        )}

        {/* AI Enhanced Review Section */}
        {review.refined_review && (
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-5 w-5 text-primary" />
              <h4 className="font-medium">AI Enhanced Review</h4>
            </div>
            <p className="text-sm text-gray-600">{review.refined_review}</p>
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