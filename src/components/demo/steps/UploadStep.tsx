import { ReceiptUploadSection } from "../ReceiptUploadSection";
import { ReceiptAnalysisDisplay } from "../ReceiptAnalysisDisplay";
import { Upload } from "lucide-react";

interface UploadStepProps {
  isAnalyzing: boolean;
  analysisResult: any;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadStep = ({ isAnalyzing, analysisResult, onFileSelect }: UploadStepProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
        <Upload className="h-5 w-5" />
        <h3>Step 2 (Optional): Add your receipt to enhance your review with specific details</h3>
      </div>
      <ReceiptUploadSection 
        onFileSelect={onFileSelect}
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
      />
      {analysisResult && (
        <ReceiptAnalysisDisplay analysisResult={analysisResult} />
      )}
    </div>
  );
};