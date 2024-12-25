import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AiPromptSection } from "./AiPromptSection";
import { VoucherSection } from "./VoucherSection";
import { EmailHeader } from "./EmailHeader";
import { EmailContent } from "./EmailContent";
import { EmailPreview } from "./EmailPreview";

interface EmailCompositionFormProps {
  onSend: (subject: string, content: string) => Promise<void>;
  disabled?: boolean;
  restaurantInfo?: {
    restaurantName: string;
    websiteUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    phoneNumber: string;
    bookingUrl: string;
    googleMapsUrl: string;
  };
}

export const EmailCompositionForm = ({ onSend, disabled, restaurantInfo }: EmailCompositionFormProps) => {
  const { toast } = useToast();
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const handleSend = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide both subject and content for the email.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      await onSend(emailSubject, htmlContent || emailContent);
      setEmailSubject("");
      setEmailContent("");
      setHtmlContent("");
      setUploadedImages([]);
      setShowPreview(false);
      toast({
        title: "Email sent successfully",
        description: "Your email campaign has been sent.",
      });
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: "Failed to send email",
        description: "There was an error sending your email campaign.",
        variant: "destructive",
      });
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
        
        const { error: uploadError } = await supabase.storage
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

  const insertImagesIntoContent = () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No images to add",
        description: "Please upload images first.",
        variant: "destructive",
      });
      return;
    }

    const formattedContent = emailContent.split('\n').map(paragraph => 
      paragraph.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6; text-align: left;">${paragraph}</p>` : ''
    ).join('\n');

    const imageHtml = uploadedImages.map(url => 
      `<img src="${url}" alt="Email content image" style="max-width: 100%; height: auto; margin: 10px 0;" />`
    ).join('\n');

    const newHtmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; text-align: left;">
        ${formattedContent}
        <div style="margin: 20px 0;">
          ${imageHtml}
        </div>
      </div>
    `;

    setHtmlContent(newHtmlContent);
    setShowPreview(true);
  };

  const handleVoucherGenerated = (voucherHtml: string) => {
    setHtmlContent(prevHtml => {
      const baseHtml = prevHtml || `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; text-align: left;">
        ${emailContent.split('\n').map(paragraph => 
          paragraph.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6; text-align: left;">${paragraph}</p>` : ''
        ).join('\n')}
      </div>`;
      return baseHtml.replace('</div>', `${voucherHtml}</div>`);
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
        <EmailHeader 
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
        />

        <EmailContent 
          emailContent={emailContent}
          setEmailContent={setEmailContent}
        />

        <div>
          <Label>Upload Images</Label>
          <div className="mt-2 space-y-2">
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
            {uploadedImages.length > 0 && (
              <Button
                variant="secondary"
                onClick={insertImagesIntoContent}
                className="w-full"
              >
                Add Images to Email
              </Button>
            )}
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

      <EmailPreview 
        emailSubject={emailSubject}
        htmlContent={htmlContent || emailContent}
        showPreview={showPreview}
        restaurantInfo={restaurantInfo || {
          restaurantName: "",
          websiteUrl: "",
          facebookUrl: "",
          instagramUrl: "",
          phoneNumber: "",
          bookingUrl: "",
          googleMapsUrl: "",
        }}
      />
    </div>
  );
};