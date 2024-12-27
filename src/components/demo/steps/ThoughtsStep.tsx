import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface ThoughtsStepProps {
  reviewText: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

export const ThoughtsStep = ({ reviewText, onChange, onComplete }: ThoughtsStepProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-primary">
        <MessageSquare className="h-5 w-5" />
        <h3>Step 1: Share some positive thoughts</h3>
      </div>
      <Textarea
        value={reviewText}
        onBlur={(e) => {
          if (e.target.value.trim().length > 0) onComplete();
        }}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="What did you love about your visit? Tell us about the amazing food, exceptional service, or memorable moments!"
        className="min-h-[150px] bg-white/50 font-medium resize-none"
      />
    </div>
  );
};