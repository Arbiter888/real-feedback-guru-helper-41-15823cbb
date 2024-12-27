import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AiPromptSection } from "./AiPromptSection";
import { VoucherSection } from "./VoucherSection";
import { EmailHeader } from "./EmailHeader";
import { EmailContent } from "./EmailContent";
import { EmailPreview } from "./EmailPreview";
import { ImageUploadSection, UploadedImage } from "./ImageUploadSection";

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

  const updateEmailContent = () => {
    const formattedContent = emailContent.split('\n').map(paragraph => 
      paragraph.trim() ? `<p style="margin: 0 0 15px 0; line-height: 1.6; text-align: left;">${paragraph}</p>` : ''
    ).join('\n');

    // Add images first
    const addedImages = uploadedImages
      .filter(img => img.added)
      .map(img => `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${img.url}" alt="${img.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
          ${img.title ? `<p style="margin: 10px 0; font-style: italic; color: #666;">${img.title}</p>` : ''}
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

  const handleVoucherGenerated = (voucherHtml: string) => {
    // Replace any existing voucher content
    const contentWithoutVoucher = htmlContent.replace(/<div style="margin: 2rem 0; text-align: center;">.*?<\/div>/s, '');
    const updatedHtmlContent = contentWithoutVoucher.replace('</div>', `${voucherHtml}</div>`);
    setHtmlContent(updatedHtmlContent);
    setShowPreview(true);
  };

  return (
    <div className="space-y-4">
      <AiPromptSection 
        onEmailGenerated={(subject, content) => {
          setEmailSubject(subject);
          setEmailContent(content);
          updateEmailContent();
        }}
      />

      <div className="space-y-4 bg-white/50 rounded-lg p-4 border">
        <EmailHeader 
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
        />

        <EmailContent 
          emailContent={emailContent}
          setEmailContent={(content) => {
            setEmailContent(content);
            updateEmailContent();
          }}
        />

        <ImageUploadSection
          uploadedImages={uploadedImages}
          onImagesChange={setUploadedImages}
          onContentUpdate={updateEmailContent}
        />
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