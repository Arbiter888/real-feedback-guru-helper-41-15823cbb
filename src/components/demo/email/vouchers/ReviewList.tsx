import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Mail, Receipt, User } from "lucide-react";
import { VoucherSuggestions } from "./VoucherSuggestions";
import { Review } from "../../email/ReviewVoucherSection";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
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
            </div>

            {/* Review Content */}
            <div className="space-y-2">
              <p className="text-sm">{review.review_text}</p>
              {review.receipt_data && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Receipt className="h-4 w-4" />
                  <span>Total spent: ${review.receipt_data.total_amount}</span>
                </div>
              )}
            </div>

            {/* Voucher Generation Section */}
            <VoucherSuggestions review={review} />
          </div>
        </Card>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No reviews available for voucher generation.
        </div>
      )}
    </div>
  );
};