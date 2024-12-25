import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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
    setIsSending(true);
    try {
      await onSend(emailSubject, emailContent);
      setEmailSubject("");
      setEmailContent("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="emailSubject">Email Subject</Label>
        <Input
          id="emailSubject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Enter email subject"
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
        />
      </div>
      <div className="flex gap-4">
        <Button
          onClick={handleSend}
          disabled={isSending || disabled || !emailContent.trim() || !emailSubject.trim()}
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
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          disabled={!emailContent.trim()}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>
      {showPreview && emailContent && (
        <div className="mt-6">
          <Label>Email Preview</Label>
          <div className="mt-2 p-4 border rounded-lg bg-white">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: emailContent }} />
          </div>
        </div>
      )}
    </div>
  );
};