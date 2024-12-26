import { ReviewMetadata, isReceiptData } from "@/types/email";
import { MessageSquare, Receipt, Bot } from "lucide-react";

interface MetadataDisplayProps {
  metadata: ReviewMetadata;
  formatCurrency: (amount: number) => string;
}

export const MetadataDisplay = ({ metadata, formatCurrency }: MetadataDisplayProps) => {
  return (
    <div className="space-y-4">
      {metadata.initial_review && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Step 1: Initial Thoughts</h4>
          </div>
          <p className="text-sm text-gray-700">{metadata.initial_review}</p>
        </div>
      )}

      {metadata.receipt_analysis && isReceiptData(metadata.receipt_analysis) && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Step 2: Receipt Analysis</h4>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-sm">
              Total Amount: {formatCurrency(metadata.receipt_analysis.total_amount)}
            </p>
            <div className="space-y-1">
              {metadata.receipt_analysis.items.map((item, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {metadata.refined_review && (
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Step 3: Enhanced Review</h4>
          </div>
          <p className="text-sm text-gray-700">{metadata.refined_review}</p>
        </div>
      )}

      {(metadata.server_name || metadata.restaurant_name || metadata.reward_code) && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 mt-4">
          <div className="space-y-1 text-sm text-gray-600">
            {metadata.restaurant_name && (
              <p>Restaurant: {metadata.restaurant_name}</p>
            )}
            {metadata.server_name && (
              <p>Server: {metadata.server_name}</p>
            )}
            {metadata.reward_code && (
              <p>Reward Code: {metadata.reward_code}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};