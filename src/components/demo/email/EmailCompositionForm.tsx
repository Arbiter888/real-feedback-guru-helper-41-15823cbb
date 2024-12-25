import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailSubjectInput } from "./EmailSubjectInput";
import { EmailContentInput } from "./EmailContentInput";
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
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerateEmail = async () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate the email.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-email', {
        body: { prompt },
      });

      if (error) throw error;

      setEmailSubject(data.subject || '');
      setEmailContent(data.content || '');
      
      toast({
        title: "Email generated",
        description: "Your email has been generated based on the prompt.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate email content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
      <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="prompt">AI Generation Prompt</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the email you want to generate..."
            />
          </div>
          <Button
            onClick={handleGenerateEmail}
            disabled={isGenerating || !prompt}
            className="mt-6"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

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
      </div>

      <EmailSubjectInput
        value={emailSubject}
        onChange={setEmailSubject}
        prompt={prompt}
      />

      <EmailContentInput
        value={emailContent}
        onChange={setEmailContent}
        prompt={prompt}
        onGenerateHtml={setHtmlContent}
      />

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