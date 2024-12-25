import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AiPromptSection } from "./AiPromptSection";
import { VoucherSection } from "./VoucherSection";

interface EmailCompositionFormProps {
  onSend: (subject: string, content: string) => Promise<void>;
  disabled?: boolean;
}

export const EmailCompositionForm = ({ onSend, disabled }: EmailCompositionFormProps) => {
  const { toast } = useToast();
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(emailSubject, htmlContent || emailContent);
      setEmailSubject("");
      setEmailContent("");
      setHtmlContent("");
      setUploadedImages([]);
      setShowPreview(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('email_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('email_images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      
      toast({
        title: "Images uploaded successfully",
        description: `${files.length} image(s) have been uploaded.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images.",
        variant: "destructive",
      });
    }
  };

  const handleVoucherGenerated = (voucherHtml: string) => {
    setHtmlContent(prevHtml => {
      const content = prevHtml || emailContent;
      return `${content}\n\n${voucherHtml}`;
    });
    setShowPreview(true);
  };

  return (
    <div className="space-y-4">
      <AiPromptSection 
        onEmailGenerated={(subject, content) => {
          setEmailSubject(subject);
          setEmailContent(content);
        }}
      />

      <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
        <div>
          <Label>Upload Images</Label>
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Images
            </Button>
          </div>
          {uploadedImages.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {uploadedImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="h-16 w-16 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailSubject">Email Subject</Label>
          <Input
            id="emailSubject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Enter email subject"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailContent">Email Content</Label>
          <textarea
            id="emailContent"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Enter your email content"
            className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <VoucherSection onVoucherGenerated={handleVoucherGenerated} />

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
          disabled={!emailContent.trim() && !htmlContent.trim()}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {showPreview && (htmlContent || emailContent) && (
        <div className="mt-6">
          <Label>Email Preview</Label>
          <div className="mt-2 p-4 border rounded-lg bg-white">
            {htmlContent ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm">{emailContent}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};