import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, TestTube2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AiPromptSection } from "./AiPromptSection";
import { VoucherSection } from "./VoucherSection";
import { EmailHeader } from "./EmailHeader";
import { EmailContent } from "./EmailContent";
import { EmailPreview } from "./EmailPreview";
import { ImageUploadSection } from "./ImageUploadSection";
import { SavedCampaignsList } from "./SavedCampaignsList";
import { SaveCampaignDialog } from "./SaveCampaignDialog";
import { supabase } from "@/integrations/supabase/client";
import { formatEmailContent } from "./EmailContentFormatter";
import { useQuery } from "@tanstack/react-query";

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
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Get the default email list for the restaurant
  const { data: emailList } = useQuery({
    queryKey: ['email-list', restaurantInfo?.restaurantName],
    queryFn: async () => {
      if (!restaurantInfo?.restaurantName) return null;
      
      const { data, error } = await supabase
        .rpc('get_or_create_restaurant_email_list', {
          restaurant_name: restaurantInfo.restaurantName
        });
      
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantInfo?.restaurantName,
  });

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
      await onSend(emailSubject, emailContent);
      setEmailSubject("");
      setEmailContent("");
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
          htmlContent: emailContent,
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

  const handleLoadCampaign = (campaign: any) => {
    setEmailSubject(campaign.subject);
    setEmailContent(campaign.content);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Email Marketing Hub</h2>
        {emailList && (
          <SaveCampaignDialog
            listId={emailList}
            emailSubject={emailSubject}
            emailContent={emailContent}
          />
        )}
      </div>

      {emailList && (
        <div className="bg-white/50 rounded-lg p-4 border">
          <h3 className="font-medium mb-4">Saved Campaigns</h3>
          <SavedCampaignsList
            listId={emailList}
            onLoadCampaign={handleLoadCampaign}
          />
        </div>
      )}

      <AiPromptSection 
        onEmailGenerated={(subject, content) => {
          setEmailSubject(subject);
          setEmailContent(content);
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

        <ImageUploadSection />
      </div>

      <VoucherSection />

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
          disabled={!emailContent.trim()}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {showPreview && (
        <EmailPreview 
          emailSubject={emailSubject}
          htmlContent={emailContent}
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
      )}
    </div>
  );
};