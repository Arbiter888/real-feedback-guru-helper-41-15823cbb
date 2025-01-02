import { CustomerMetadata } from "@/types/customer";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface CustomerMetadataDisplayProps {
  metadata: CustomerMetadata;
}

export const CustomerMetadataDisplay = ({ metadata }: CustomerMetadataDisplayProps) => {
  if (!metadata) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {Object.entries(metadata.reviews || {}).map(([reviewId, review]) => (
        <Card key={reviewId} className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Review from {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</p>
              {review.server_name && (
                <p className="text-sm text-muted-foreground">Server: {review.server_name}</p>
              )}
            </div>
          </div>
          
          {review.receipt_data && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Receipt Total: {formatCurrency(review.receipt_data.total_amount)}</p>
              <div className="text-sm text-muted-foreground">
                {review.receipt_data.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {review.review_text && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Initial Review:</p>
              <p className="text-sm text-muted-foreground">{review.review_text}</p>
            </div>
          )}

          {review.refined_review && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Enhanced Review:</p>
              <p className="text-sm text-muted-foreground">{review.refined_review}</p>
            </div>
          )}
        </Card>
      ))}

      {metadata.tips && Object.entries(metadata.tips).length > 0 && (
        <Card className="p-4 space-y-2">
          <h4 className="font-medium">Tip History</h4>
          <div className="space-y-2">
            {Object.entries(metadata.tips).map(([voucherCode, tip]) => (
              <div key={voucherCode} className="flex justify-between text-sm">
                <span>{formatCurrency(tip.tip_amount)} tip to {tip.server_name}</span>
                <span className={tip.voucher_status === 'used' ? 'text-muted-foreground' : 'text-primary'}>
                  {formatCurrency(tip.voucher_amount)} {tip.voucher_status === 'used' ? 'used' : 'available'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};