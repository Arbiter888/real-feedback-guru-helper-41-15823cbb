import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Review {
  id: string;
  review_text: string;
  created_at: string;
  refined_review?: string;
  receipt_data?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
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

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Original Review</TableHead>
            <TableHead>AI Enhanced Review</TableHead>
            <TableHead>Receipt Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="whitespace-nowrap">
                {formatDate(review.created_at)}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {review.review_text}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {review.refined_review || 'Not enhanced'}
              </TableCell>
              <TableCell>
                {review.receipt_data ? (
                  <div className="text-sm">
                    <p>Total: ${review.receipt_data.total_amount}</p>
                    <p className="text-xs text-gray-500">
                      {review.receipt_data.items.length} items
                    </p>
                  </div>
                ) : (
                  'No receipt'
                )}
              </TableCell>
            </TableRow>
          ))}
          {reviews.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                No reviews yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};