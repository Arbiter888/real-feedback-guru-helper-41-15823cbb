import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, TestTube2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AiPromptSection } from "./AiPromptSection";
import { VoucherSection } from "./VoucherSection";
import { EmailHeader } from "./EmailHeader";
import { EmailContent } from "./EmailContent";
import { EmailPreview } from "./EmailPreview";
import { ImageUploadSection, UploadedImage } from "./ImageUploadSection";
import { supabase } from "@/integrations/supabase/client";
import { formatEmailContent } from "./EmailContentFormatter";

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
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [voucherHtml, setVoucherHtml] = useState<string>("");
  const [footerHtml, setFooterHtml] = useState<string>("");

  useEffect(() => {
    const formattedContent = formatEmailContent({
      content: emailContent,
      images: uploadedImages,
      restaurantName: restaurantInfo?.restaurantName || 'Your Restaurant',
      voucherHtml
    });
    setHtmlContent(formattedContent);
    if (emailContent) setShowPreview(true);
  }, [emailContent, uploadedImages, restaurantInfo, voucherHtml]);

  useEffect(() => {
    const footerImagesHtml = uploadedImages.filter(img => img.added && img.isFooter)
      .map(img => `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${img.url}" alt="${img.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
          ${img.title ? `<p style="margin: 10px 0; font-style: italic; color: #666;">${img.title}</p>` : ''}
        </div>
      `).join('\n') || '';

    setFooterHtml(`
      <div style="margin-top: 30px; padding: 20px 0; border-top: 1px solid #eee;">
        ${footerImagesHtml}
        <div style="margin-bottom: 20px;">
          ${restaurantInfo.phoneNumber ? `
            <p style="margin: 8px 0;">
              <a href="tel:${restaurantInfo.phoneNumber}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
                📞 ${restaurantInfo.phoneNumber}
              </a>
            </p>
          ` : ''}
          ${restaurantInfo.googleMapsUrl ? `
            <p style="margin: 8px 0;">
              <a href="${restaurantInfo.googleMapsUrl}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
                📍 Find us on Google Maps
              </a>
            </p>
          ` : ''}
        </div>
        <div style="margin-top: 16px;">
          ${restaurantInfo.websiteUrl ? `
            <a href="${restaurantInfo.websiteUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px; font-weight: 500;">
              🌐 Visit our Website
            </a>
          ` : ''}
          ${restaurantInfo.facebookUrl ? `
            <a href="${restaurantInfo.facebookUrl}" style="color: #E94E87; text-decoration: none; margin-right: 16px; font-weight: 500;">
              👥 Follow us on Facebook
            </a>
          ` : ''}
          ${restaurantInfo.instagramUrl ? `
            <a href="${restaurantInfo.instagramUrl}" style="color: #E94E87; text-decoration: none; font-weight: 500;">
              📸 Follow us on Instagram
            </a>
          ` : ''}
        </div>
      </div>
    `);
  }, [restaurantInfo, uploadedImages]);

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
      await onSend(emailSubject, '<div>' + (htmlContent || emailContent) + footerHtml + '</div>');
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

  const handleSendTest = async () => {
    if (!testEmail || !emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide test email address, subject, and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      const response = await supabase.functions.invoke("send-test-email", {
        body: {
          to: testEmail,
          subject: emailSubject,
          htmlContent: '<div>' + (htmlContent || emailContent) + footerHtml + '</div>',
          restaurantInfo,
        },
      });

      if (response.error) throw new Error(response.error.message);

      toast({
        title: "Test email sent",
        description: `Test email sent to ${testEmail}`,
      });
    } catch (error) {
      console.error('Test email error:', error);
      toast({
        title: "Failed to send test email",
        description: "There was an error sending the test email.",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-4">
      <AiPromptSection 
        onEmailGenerated={(subject, content) => {
          setEmailSubject(subject);
          setEmailContent(content);
          const formattedContent = formatEmailContent({
            content,
            images: uploadedImages,
            restaurantName: restaurantInfo?.restaurantName || 'Your Restaurant',
            voucherHtml
          });
          setHtmlContent(formattedContent);
          setShowPreview(true);
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

        <ImageUploadSection
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      </div>

      <VoucherSection setVoucherHtml={setVoucherHtml} />

      <div className="flex gap-4 items-center">
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
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Email Campaign
            </>
          )}
        </Button>
        
        <div className="flex gap-2 items-center flex-1">
          <Input
            type="email"
            placeholder="Test email address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={handleSendTest}
            disabled={isSendingTest || !testEmail || !emailContent.trim() || !emailSubject.trim()}
          >
            {isSendingTest ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube2 className="mr-2 h-4 w-4" />
                Test
              </>
            )}
          </Button>
        </div>

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
        footerHtml={footerHtml}
      />
    </div>
  );
};