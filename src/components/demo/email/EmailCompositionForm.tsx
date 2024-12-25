import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AiPromptSection } from "./AiPromptSection";
import { EmailPreviewSection } from "./EmailPreviewSection";

interface EmailCompositionFormProps {
  onSend: (subject: string, content: string) => Promise<void>;
  disabled?: boolean;
}

export const EmailCompositionForm = ({ onSend, disabled }: EmailCompositionFormProps) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = async () => {
    if (!emailSubject?.trim() || !emailContent?.trim()) return;
    
    setIsSending(true);
    try {
      await onSend(emailSubject, emailContent);
      setEmailSubject("");
      setEmailContent("");
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerate = (subject: string, content: string) => {
    setEmailSubject(subject);
    setEmailContent(content);
  };

  return (
    <div className="space-y-4">
      <AiPromptSection onGenerate={handleGenerate} disabled={disabled} />

      <div>
        <Label htmlFor="emailSubject">Email Subject</Label>
        <Input
          id="emailSubject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Enter email subject"
          disabled={disabled}
        />
      </div>

      <div>
        <Label htmlFor="emailContent">Email Content (HTML)</Label>
        <Textarea
          id="emailContent"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Enter your email content (HTML supported)"
          className="min-h-[200px] font-mono"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleSend}
          disabled={isSending || disabled || !emailContent?.trim() || !emailSubject?.trim()}
          className="flex-1"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Email Campaign"
          )}
        </Button>
      </div>

      <EmailPreviewSection 
        emailContent={emailContent}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />
    </div>
  );
};