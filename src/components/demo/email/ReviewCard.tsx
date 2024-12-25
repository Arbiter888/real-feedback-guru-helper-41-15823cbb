import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Eye, EyeOff } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    review_text: string;
    created_at: string;
    server_name: string | null;
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
  selectedReviewId,
  onTogglePreview,
  showPreview
}: ReviewCardProps) => {
  const getSentimentColor = (review: string) => {
    const lowercaseReview = review.toLowerCase();
    const positiveWords = ['great', 'excellent', 'amazing', 'good', 'love', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointed', 'worst'];
    
    const positiveCount = positiveWords.filter(word => lowercaseReview.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowercaseReview.includes(word)).length;
    
    return positiveCount > negativeCount ? "default" : negativeCount > positiveCount ? "destructive" : "secondary";
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={getSentimentColor(review.review_text)}>
              {getSentimentColor(review.review_text) === "default" ? (
                <ThumbsUp className="w-3 h-3 mr-1" />
              ) : (
                <ThumbsDown className="w-3 h-3 mr-1" />
              )}
              {getSentimentColor(review.review_text) === "default" ? "Positive" : "Needs Attention"}
            </Badge>
            {review.server_name && (
              <Badge variant="outline">Server: {review.server_name}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
          <p className="text-sm">{review.review_text}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onGenerateFollowUp(review.id)}
            disabled={isGenerating}
            size="sm"
          >
            Generate Follow-up
          </Button>
          {selectedReviewId === review.id && (
            <Button
              onClick={onTogglePreview}
              variant="outline"
              size="sm"
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};