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

interface UploadedImage {
  url: string;
  title: string;
  added: boolean;
}

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
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [currentImageTitle, setCurrentImageTitle] = useState<string>("");

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

        return {
          url: publicUrl,
          title: "",
          added: false
        };
      });

      const newImages = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...newImages]);
      
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

  const handleAddImageToEmail = (index: number) => {
    if (!uploadedImages[index].title) {
      toast({
        title: "Missing image title",
        description: "Please provide a title for the image before adding it to the email.",
        variant: "destructive",
      });
      return;
    }

    const updatedImages = [...uploadedImages];
    updatedImages[index] = { ...updatedImages[index], added: true };
    setUploadedImages(updatedImages);

    const imageHtml = `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${uploadedImages[index].url}" alt="${uploadedImages[index].title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
        <p style="margin: 10px 0; font-style: italic; color: #666;">${uploadedImages[index].title}</p>
      </div>
    `;

    const formattedContent = emailContent.split('\n').map(paragraph => 
      paragraph.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6; text-align: left;">${paragraph}</p>` : ''
    ).join('\n');

    const addedImages = uploadedImages
      .filter(img => img.added)
      .map(img => `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${img.url}" alt="${img.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
          <p style="margin: 10px 0; font-style: italic; color: #666;">${img.title}</p>
        </div>
      `).join('\n');

    const newHtmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        ${formattedContent}
        ${addedImages}
      </div>
    `;

    setHtmlContent(newHtmlContent);
    setShowPreview(true);
  };

  const handleImageTitleChange = (index: number, title: string) => {
    const updatedImages = [...uploadedImages];
    updatedImages[index] = { ...updatedImages[index], title };
    setUploadedImages(updatedImages);
  };

  const handleVoucherGenerated = (voucherHtml: string) => {
    const baseHtml = `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      ${emailContent.split('\n').map(paragraph => 
        paragraph.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6; text-align: left;">${paragraph}</p>` : ''
      ).join('\n')}
      ${uploadedImages
        .filter(img => img.added)
        .map(img => `
          <div style="text-align: center; margin: 20px 0;">
            <img src="${img.url}" alt="${img.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
            <p style="margin: 10px 0; font-style: italic; color: #666;">${img.title}</p>
          </div>
        `).join('\n')}
      ${voucherHtml}
    </div>`;
    
    setHtmlContent(baseHtml);
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
          </div>
          {uploadedImages.length > 0 && (
            <div className="mt-4 space-y-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                  <img
                    src={image.url}
                    alt={`Uploaded image ${index + 1}`}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <Input
                      placeholder="Enter image title"
                      value={image.title}
                      onChange={(e) => handleImageTitleChange(index, e.target.value)}
                      className="mb-2"
                    />
                    <Button
                      size="sm"
                      variant={image.added ? "secondary" : "default"}
                      onClick={() => handleAddImageToEmail(index)}
                      disabled={image.added}
                    >
                      {image.added ? "Added to Email" : "Add to Email"}
                    </Button>
                  </div>
                </div>
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