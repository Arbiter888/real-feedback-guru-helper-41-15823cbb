interface ReceiptAnalysisDisplayProps {
  analysisResult: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
}

export const ReceiptAnalysisDisplay = ({ analysisResult }: ReceiptAnalysisDisplayProps) => {
  if (!analysisResult) return null;

  return (
    <div className="bg-secondary/5 rounded-lg p-6 space-y-4 border border-secondary/10">
      <h3 className="font-semibold text-lg text-primary">Receipt Details</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-secondary/10 pb-4">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="text-xl font-semibold">${analysisResult.total_amount.toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Items Ordered</h4>
          <ul className="divide-y divide-secondary/10">
            {analysisResult.items?.map((item, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span>{item.name}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};