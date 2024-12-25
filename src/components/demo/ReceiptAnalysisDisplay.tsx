interface ReceiptAnalysisDisplayProps {
  analysisResult: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  };
}

export const ReceiptAnalysisDisplay = ({ analysisResult }: ReceiptAnalysisDisplayProps) => {
  if (!analysisResult) return null;

  return (
    <div className="bg-secondary/5 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold">Receipt Analysis</h3>
      <div className="space-y-2">
        <p><strong>Total Amount:</strong> ${analysisResult.total_amount}</p>
        <div>
          <strong>Items:</strong>
          <ul className="list-disc list-inside">
            {analysisResult.items?.map((item, index) => (
              <li key={index}>{item.name} - ${item.price}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};