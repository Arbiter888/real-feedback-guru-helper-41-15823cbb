import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EmailPreviewSectionProps {
  emailContent: string;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const EmailPreviewSection = ({ 
  emailContent, 
  showPreview, 
  onTogglePreview 
}: EmailPreviewSectionProps) => {
  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={onTogglePreview}
        disabled={!emailContent?.trim()}
      >
        {showPreview ? "Hide Preview" : "Show Preview"}
      </Button>

      {showPreview && emailContent && (
        <div className="mt-6">
          <Label>Email Preview</Label>
          <div className="mt-2 p-4 border rounded-lg bg-white">
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: emailContent }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};