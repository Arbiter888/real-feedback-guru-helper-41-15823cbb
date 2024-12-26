import { MessageSquare, Receipt, Bot } from "lucide-react";
import { CustomerMetadata } from "@/types/customer";

interface CustomerReviewDetailsProps {
  metadata: CustomerMetadata;
}

export const CustomerReviewDetails = ({ metadata }: CustomerReviewDetailsProps) => {
  if (!metadata.initial_review) return null;

  return (
    <div className="grid gap-4">
      {/* Initial Review */}
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h4 className="font-medium">Initial Review</h4>
        </div>
        <p className="text-sm">{metadata.initial_review}</p>
      </div>

      {/* Receipt Data */}
      {metadata.receipt_data && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Receipt Details</h4>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Total Amount: ${metadata.receipt_data.total_amount.toFixed(2)}
            </p>
            <div className="space-y-1">
              {metadata.receipt_data.items.map((item, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Review */}
      {metadata.refined_review && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Enhanced Review</h4>
          </div>
          <p className="text-sm">{metadata.refined_review}</p>
        </div>
      )}
    </div>
  );
};