import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Receipt, User, ThumbsUp, ThumbsDown, Heart, Meh } from "lucide-react";
import { VoucherSuggestions } from "./VoucherSuggestions";
import { Review } from "../ReviewVoucherSection";

interface ReviewListProps {
  reviews: Review[];
  onGenerateVoucher: (review: Review) => Promise<void>;
}

const getSentimentInfo = (review: string) => {
  const lowerReview = review.toLowerCase();
  if (lowerReview.includes('loved') || lowerReview.includes('amazing') || lowerReview.includes('excellent')) {
    return { icon: ThumbsUp, label: 'Loved it!', color: 'bg-green-100 text-green-800' };
  }
  if (lowerReview.includes('good') || lowerReview.includes('nice') || lowerReview.includes('enjoyed')) {
    return { icon: Heart, label: 'Liked it', color: 'bg-pink-100 text-pink-800' };
  }
  if (lowerReview.includes('okay') || lowerReview.includes('average')) {
    return { icon: Meh, label: 'Neutral', color: 'bg-yellow-100 text-yellow-800' };
  }
  if (lowerReview.includes('bad') || lowerReview.includes('terrible') || lowerReview.includes('poor')) {
    return { icon: ThumbsDown, label: 'Disappointed', color: 'bg-red-100 text-red-800' };
  }
  return { icon: Heart, label: 'Positive', color: 'bg-blue-100 text-blue-800' };
};

export const ReviewList = ({ reviews, onGenerateVoucher }: ReviewListProps) => {
  return (
    <div className="space-y-4">
      {reviews?.map((review) => {
        const sentiment = getSentimentInfo(review.review_text);
        const SentimentIcon = sentiment.icon;

        return (
          <Card key={review.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(review.created_at).toLocaleDateString()}
                  {review.server_name && (
                    <>
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4" />
                      <span>Served by {review.server_name}</span>
                    </>
                  )}
                </div>
                <Badge className={sentiment.color}>
                  <SentimentIcon className="h-4 w-4 mr-1" />
                  {sentiment.label}
                </Badge>
              </div>

              {/* Review Content */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Review</h4>
                  <p className="text-sm">{review.review_text}</p>
                </div>
                
                {review.refined_review && (
                  <div className="bg-pink-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Enhanced Review</h4>
                    <p className="text-sm">{review.refined_review}</p>
                  </div>
                )}

                {review.receipt_data && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 rounded-lg p-2">
                    <Receipt className="h-4 w-4" />
                    <span>Total spent: ${review.receipt_data.total_amount}</span>
                  </div>
                )}
              </div>

              {/* Voucher Generation Section */}
              <VoucherSuggestions 
                review={review} 
                onGenerateVoucher={onGenerateVoucher}
                sentiment={sentiment}
              />
            </div>
          </Card>
        );
      })}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No reviews available for voucher generation.
        </div>
      )}
    </div>
  );
};