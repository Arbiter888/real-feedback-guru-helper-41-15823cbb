import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailCompositionForm } from "./email/EmailCompositionForm";

interface RestaurantInfo {
  restaurantName: string;
  googleMapsUrl: string;
  contactEmail: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  phoneNumber: string;
  bookingUrl: string;
  preferredBookingMethod: 'phone' | 'website';
}

interface EmailManagementSectionProps {
  restaurantInfo: RestaurantInfo;
}

export const EmailManagementSection = ({ restaurantInfo }: EmailManagementSectionProps) => {
  const { toast } = useToast();

  const sendEmailMutation = useMutation({
    mutationFn: async (params: { subject: string; content: string }) => {
      // Normalize URLs before sending
      const normalizedRestaurantInfo = {
        ...restaurantInfo,
        websiteUrl: normalizeUrl(restaurantInfo.websiteUrl),
        googleMapsUrl: normalizeUrl(restaurantInfo.googleMapsUrl),
        facebookUrl: normalizeUrl(restaurantInfo.facebookUrl),
        instagramUrl: normalizeUrl(restaurantInfo.instagramUrl),
        bookingUrl: normalizeUrl(restaurantInfo.bookingUrl),
      };

      const { data: lists } = await supabase
        .from("email_lists")
        .select("id")
        .limit(1);

      if (!lists?.length) {
        throw new Error("No email list found");
      }

      const response = await supabase.functions.invoke("send-bulk-email", {
        body: {
          listId: lists[0].id,
          subject: params.subject,
          htmlContent: params.content,
          restaurantInfo: normalizedRestaurantInfo,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Emails sent successfully",
        description: `${data.successCount} emails sent. ${data.errorCount} failed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send emails",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendEmail = async (subject: string, content: string) => {
    await sendEmailMutation.mutateAsync({ subject, content });
  };

  // Helper function to normalize URLs
  function normalizeUrl(url: string): string {
    if (!url) return '';
    
    try {
      // Remove any trailing colons that might be causing issues
      url = url.replace(/:+$/, '');
      
      // If the URL doesn't start with http:// or https://, add https://
      if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
      }
      
      // Create URL object to validate and normalize
      const urlObject = new URL(url);
      return urlObject.toString();
    } catch (error) {
      console.warn('Invalid URL:', url);
      return '';
    }
  }

  return (
    <div className="space-y-8">
      {/* Email Composition Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Send Email Campaign</h2>
        <EmailCompositionForm
          onSend={handleSendEmail}
          restaurantInfo={restaurantInfo}
        />
      </div>
    </div>
  );
};