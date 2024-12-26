import { Check, Clock } from "lucide-react";

interface StepProgressDisplayProps {
  steps: {
    initial_thoughts: boolean;
    receipt_uploaded: boolean;
    review_enhanced: boolean;
    copied_to_google: boolean;
  };
  timestamps?: {
    initial_thoughts?: string;
    receipt_uploaded?: string;
    review_enhanced?: string;
    review_copied?: string;
  };
}

export const StepProgressDisplay = ({ steps, timestamps }: StepProgressDisplayProps) => {
  const stepsList = [
    { key: 'initial_thoughts', label: 'Initial Thoughts', timestamp: timestamps?.initial_thoughts },
    { key: 'receipt_uploaded', label: 'Receipt Upload', timestamp: timestamps?.receipt_uploaded },
    { key: 'review_enhanced', label: 'Review Enhancement', timestamp: timestamps?.review_enhanced },
    { key: 'copied_to_google', label: 'Copied to Google', timestamp: timestamps?.review_copied }
  ];

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <h4 className="font-medium text-sm mb-3">Review Progress</h4>
      <div className="grid gap-2">
        {stepsList.map((step) => (
          <div key={step.key} className="flex items-center gap-2 text-sm">
            {steps[step.key as keyof typeof steps] ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Clock className="h-4 w-4 text-gray-400" />
            )}
            <span className={steps[step.key as keyof typeof steps] ? "text-gray-900" : "text-gray-500"}>
              {step.label}
            </span>
            {step.timestamp && (
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(step.timestamp).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};