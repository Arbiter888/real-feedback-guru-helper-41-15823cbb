import { ReviewMetadata, isReceiptAnalysis } from "@/types/email";
import { MessageSquare, Receipt, Bot } from "lucide-react";

interface MetadataDisplayProps {
  metadata: ReviewMetadata;
  formatCurrency: (amount: number) => string;
}

export const MetadataDisplay = ({ metadata, formatCurrency }: MetadataDisplayProps) => {
  return (
    <div className="space-y-4">
      {metadata.initial_review && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Initial Thoughts</h4>
          </div>
          <p className="text-sm text-gray-700">{metadata.initial_review}</p>
        </div>
      )}

      {metadata.receipt_analysis && isReceiptAnalysis(metadata.receipt_analysis) && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Receipt Analysis</h4>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-2">
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
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Enhanced Review</h4>
          </div>
          <p className="text-sm text-gray-700">{metadata.refined_review}</p>
        </div>
      )}

      {(metadata.server_name || metadata.restaurant_name || metadata.reward_code) && (
        <div className="text-sm text-gray-600 mt-4 pt-4 border-t">
          {metadata.server_name && <p>Server: {metadata.server_name}</p>}
          {metadata.restaurant_name && <p>Restaurant: {metadata.restaurant_name}</p>}
          {metadata.reward_code && <p>Reward Code: {metadata.reward_code}</p>}
        </div>
      )}
    </div>
  );
};