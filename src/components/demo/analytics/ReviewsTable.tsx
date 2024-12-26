import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Receipt, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Review {
  id: string;
  review_text: string;
  created_at: string;
  refined_review?: string;
  receipt_data?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
  server_name?: string;
}

interface ReviewsTableProps {
  reviews: Review[];
}

export const ReviewsTable = ({ reviews }: ReviewsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Review from {formatDate(review.created_at)}
              {review.server_name && (
                <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Server: {review.server_name}
                </span>
              )}
            </h3>
          </div>

          {/* Step 1: Initial Thoughts */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Step 1: Initial Thoughts</h4>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4">
              <p className="text-gray-700">{review.review_text}</p>
            </div>
          </div>

          {/* Step 2: Receipt Analysis */}
          {review.receipt_data && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Step 2: Receipt Analysis</h4>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4">
                <p className="font-medium mb-2">
                  Total Amount: {formatCurrency(review.receipt_data.total_amount)}
                </p>
                <div className="space-y-1">
                  {review.receipt_data.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Step 3: Enhanced Review</h4>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4">
                <p className="text-gray-700">{review.refined_review}</p>
              </div>
            </div>
          )}
        </Card>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reviews yet
        </div>
      )}
    </div>
  );
};