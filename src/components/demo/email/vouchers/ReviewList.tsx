import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Review } from "../ReviewVoucherSection";
import { VoucherSuggestions } from "./VoucherSuggestions";

interface ReviewListProps {
  reviews: Review[];
  onGenerateVoucher: (review: Review) => void;
}

export const ReviewList = ({ reviews, onGenerateVoucher }: ReviewListProps) => {
  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
        <div
          key={review.id}
          className="border rounded-lg p-4 space-y-2 hover:bg-gray-50"
        >
          <p className="text-sm text-gray-600">
            {new Date(review.created_at).toLocaleDateString()}
            {review.server_name && ` • Served by ${review.server_name}`}
          </p>
          <p className="font-medium">{review.review_text}</p>
          {review.receipt_data && (
            <p className="text-sm text-gray-600">
              Total spent: ${review.receipt_data.total_amount}
            </p>
          )}
          <div className="flex justify-between items-center mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateVoucher(review)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Generate Voucher Email
            </Button>
          </div>
          
          <VoucherSuggestions 
            review={review}
            onGenerateVoucher={onGenerateVoucher}
          />
        </div>
      ))}
    </div>
  );
};