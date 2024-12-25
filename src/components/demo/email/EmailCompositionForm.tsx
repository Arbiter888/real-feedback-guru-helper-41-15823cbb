import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmailHeader } from "./EmailHeader";
import { EmailContent } from "./EmailContent";
import { EmailPreview } from "./EmailPreview";
import { VoucherSection } from "./VoucherSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RestaurantInfo {
  restaurantName: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  phoneNumber: string;
  bookingUrl: string;
  googleMapsUrl: string;
}

interface EmailCompositionFormProps {
  onSend: (subject: string, content: string) => Promise<void>;
  disabled?: boolean;
  restaurantInfo: RestaurantInfo;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const EmailCompositionForm = ({
  onSend,
  disabled,
  restaurantInfo,
  showPreview,
  onTogglePreview,
}: EmailCompositionFormProps) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch scheduled voucher emails for the next campaign
  const { data: scheduledVouchers } = useQuery({
    queryKey: ["scheduled_vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_voucher_emails")
        .select("*")
        .eq("status", "scheduled")
        .is("sent_at", null)
        .not("scheduled_for", "is", null)
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject || !emailContent) return;

    setIsSubmitting(true);
    try {
      let finalContent = emailContent;
      if (scheduledVouchers?.length) {
        finalContent += "\n\n--- Special Offers ---\n\n";
        scheduledVouchers.forEach((voucher) => {
          finalContent += `${voucher.email_content}\nVoucher Code: ${voucher.voucher_code}\n\n`;
        });
      }

      await onSend(emailSubject, finalContent);
      setEmailSubject("");
      setEmailContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmailHeader
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
      />
      <EmailContent
        emailContent={emailContent}
        setEmailContent={setEmailContent}
      />

      {scheduledVouchers?.length > 0 && (
        <div className="bg-pink-50 rounded-lg p-4 mt-4">
          <h3 className="text-sm font-medium mb-2">
            {scheduledVouchers.length} voucher email(s) will be included in this campaign
          </h3>
          <div className="text-sm text-gray-600">
            These vouchers will be automatically added to your email content when sent.
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onTogglePreview}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
        <Button type="submit" disabled={disabled || isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Email"}
        </Button>
      </div>

      <EmailPreview
        emailSubject={emailSubject}
        htmlContent={emailContent}
        showPreview={showPreview}
        restaurantInfo={restaurantInfo}
      />
    </form>
  );
};