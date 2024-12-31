import { CustomerMetadata } from "@/types/customer";
import { CustomerTipHistory } from "../tips/CustomerTipHistory";
import { Card } from "@/components/ui/card";
import { Receipt, Star } from "lucide-react";

interface CustomerReviewDetailsProps {
  metadata: CustomerMetadata;
}

export const CustomerReviewDetails = ({ metadata }: CustomerReviewDetailsProps) => {
  if (!metadata) return null;

  return (
    <div className="space-y-6">
      {metadata.initial_review && (
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Star className="h-5 w-5" />
            <h4 className="font-semibold">Initial Review</h4>
          </div>
          <p className="text-gray-600">{metadata.initial_review}</p>
        </Card>
      )}

      {metadata.refined_review && (
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Star className="h-5 w-5 fill-current" />
            <h4 className="font-semibold">Enhanced Review</h4>
          </div>
          <p className="text-gray-600">{metadata.refined_review}</p>
        </Card>
      )}

      {metadata.receipt_data && (
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Receipt className="h-5 w-5" />
            <h4 className="font-semibold">Receipt Details</h4>
          </div>
          <p className="font-medium">Total: £{metadata.receipt_data.total_amount}</p>
          <div className="space-y-1">
            {metadata.receipt_data.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>£{item.price}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {metadata.tips && <CustomerTipHistory tips={metadata.tips} />}
    </div>
  );
};