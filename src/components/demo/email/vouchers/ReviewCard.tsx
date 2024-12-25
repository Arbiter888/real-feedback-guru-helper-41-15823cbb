import { Calendar, Receipt, Star, ThumbsUp, ThumbsDown, Heart, Meh, User, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Review } from "../ReviewVoucherSection";
import { useState } from "react";

interface ReviewCardProps {
  review: Review;
  customerEmail?: string;
}

const getSentimentInfo = (review: string) => {
  const lowerReview = review.toLowerCase();
  if (lowerReview.includes('loved') || lowerReview.includes('amazing') || lowerReview.includes('excellent')) {
    return { icon: ThumbsUp, label: 'Loved it!', color: 'bg-green-100 text-green-800', category: 'highly_positive' };
  }
  if (lowerReview.includes('good') || lowerReview.includes('nice') || lowerReview.includes('enjoyed')) {
    return { icon: Heart, label: 'Liked it', color: 'bg-pink-100 text-pink-800', category: 'positive' };
  }
  if (lowerReview.includes('okay') || lowerReview.includes('average')) {
    return { icon: Meh, label: 'Neutral', color: 'bg-yellow-100 text-yellow-800', category: 'neutral' };
  }
  if (lowerReview.includes('bad') || lowerReview.includes('terrible') || lowerReview.includes('poor')) {
    return { icon: ThumbsDown, label: 'Disappointed', color: 'bg-red-100 text-red-800', category: 'negative' };
  }
  return { icon: Star, label: 'Positive', color: 'bg-blue-100 text-blue-800', category: 'positive' };
};

export const ReviewCard = ({ review, customerEmail }: ReviewCardProps) => {
  const [isReceiptExpanded, setIsReceiptExpanded] = useState(false);
  const sentiment = getSentimentInfo(review.review_text);
  const SentimentIcon = sentiment.icon;

  return (
    <Card className="p-6 space-y-4">
      {/* Header with Date and Sentiment */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(review.created_at).toLocaleDateString()}
        </div>
        <Badge className={sentiment.color}>
          <SentimentIcon className="h-4 w-4 mr-1" />
          {sentiment.label}
        </Badge>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4 text-gray-500" />
        <span className="font-medium">{customerEmail || 'Anonymous Customer'}</span>
        {review.server_name && (
          <span className="text-gray-500">
            • Served by {review.server_name}
          </span>
        )}
      </div>

      {/* Reviews Side by Side */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Original Review</h4>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
            <p className="text-sm">{review.review_text}</p>
          </div>
        </div>
        
        {review.refined_review && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">EatUP! Enhanced Review</h4>
            <div className="bg-pink-50 rounded-lg p-4 min-h-[100px]">
              <p className="text-sm">{review.refined_review}</p>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Data Summary */}
      {review.receipt_data && (
        <div className="space-y-2">
          <button
            onClick={() => setIsReceiptExpanded(!isReceiptExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 w-full bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Receipt className="h-4 w-4" />
            <span>Receipt Summary</span>
            {isReceiptExpanded ? (
              <ChevronUp className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-auto" />
            )}
          </button>
          
          {isReceiptExpanded && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Total Spent:</span>
                <span className="text-green-600 font-semibold">
                  ${review.receipt_data.total_amount.toFixed(2)}
                </span>
              </div>
              
              {review.receipt_data.items && review.receipt_data.items.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Items Ordered:</p>
                  <div className="space-y-2">
                    {review.receipt_data.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm bg-white p-2 rounded"
                      >
                        <span>{item.name}</span>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};