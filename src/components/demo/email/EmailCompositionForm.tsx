import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailCompositionFormProps {
  onSend: (subject: string, content: string) => Promise<void>;
  disabled?: boolean;
}

export const EmailCompositionForm = ({ onSend, disabled }: EmailCompositionFormProps) => {
  const { toast } = useToast();
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(emailSubject, emailContent);
      setEmailSubject("");
      setEmailContent("");
      setUploadedImages([]);
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

  const generateEmail = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what kind of email you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-email', {
        body: { prompt, imageUrls: uploadedImages },
      });

      if (response.error) throw new Error(response.error.message);
      
      const { subject, content } = response.data;
      setEmailSubject(subject);
      setEmailContent(content);
      
      toast({
        title: "Email generated successfully",
        description: "Your AI-generated email is ready for review.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your email.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
        <div>
          <Label htmlFor="prompt">AI Generation Prompt</Label>
          <div className="flex gap-2">
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the email you want to generate..."
              className="flex-1"
            />
            <Button
              onClick={generateEmail}
              disabled={isGenerating || !prompt.trim()}
              variant="secondary"
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