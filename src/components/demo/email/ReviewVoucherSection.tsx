import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Calendar } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type DbReview = Database['public']['Tables']['reviews']['Row'];

interface Review {
  id: string;
  review_text: string;
  refined_review: string | null;
  receipt_data: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  } | null;
  created_at: string;
  server_name: string | null;
}

interface VoucherEmail {
  id: string;
  review_id: string;
  email_subject: string;
  email_content: string;
  voucher_code: string;
  sent_at: string | null;
  created_at: string;
  status: string;
  recipient_email?: string;
  scheduled_for?: string | null;
}

export const ReviewVoucherSection = () => {
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data as DbReview[]).map(review => ({
        ...review,
        receipt_data: review.receipt_data as Review['receipt_data']
      })) as Review[];
    },
  });

  const { data: voucherEmails, isLoading: isLoadingVouchers } = useQuery({
    queryKey: ["voucher_emails"],
    queryFn: async () => {
      const { data: voucherData, error: voucherError } = await supabase
        .from("review_voucher_emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (voucherError) throw voucherError;

      // Fetch associated email contacts for each review
      const emailPromises = voucherData.map(async (voucher) => {
        const { data: reviewData } = await supabase
          .from("reviews")
          .select("review_page_id")
          .eq("id", voucher.review_id)
          .single();

        if (reviewData?.review_page_id) {
          const { data: emailData } = await supabase
            .from("email_contacts")
            .select("email")
            .eq("list_id", reviewData.review_page_id)
            .single();

          return {
            ...voucher,
            recipient_email: emailData?.email || null
          };
        }
        return voucher;
      });

      const vouchersWithEmails = await Promise.all(emailPromises);
      return vouchersWithEmails as VoucherEmail[];
    },
  });

  const generateVoucherEmail = async (review: Review) => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-email", {
        body: {
          prompt: `Generate a personalized thank you email for a customer who left this review: "${review.review_text}". 
          ${review.receipt_data ? `They spent $${review.receipt_data.total_amount} at our restaurant.` : ""}
          ${review.server_name ? `They were served by ${review.server_name}.` : ""}
          Include a special offer or discount as a token of our appreciation.`,
          subjectOnly: false,
          contentOnly: false,
        },
      });

      if (error) throw error;

      const voucherCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error: insertError } = await supabase
        .from("review_voucher_emails")
        .insert({
          review_id: review.id,
          email_subject: data.subject,
          email_content: data.content,
          voucher_code: voucherCode,
          status: 'scheduled',
          scheduled_for: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Schedule for next week
        });

      if (insertError) throw insertError;

      toast({
        title: "Voucher email generated",
        description: "The voucher email has been scheduled for the next weekly email.",
      });
    } catch (error) {
      console.error("Error generating voucher email:", error);
      toast({
        title: "Error",
        description: "Failed to generate voucher email. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingReviews || isLoadingVouchers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Review-Based Vouchers</h2>
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 space-y-2 hover:bg-gray-50"
            >
              <p className="text-sm text-gray-600">
                {new Date(review.created_at).toLocaleDateString()}
                {review.server_name && ` • Served by ${review.server_name}`}
              </p>
              <p className="font-medium">{review.review_text}</p>
              {review.receipt_data && (
                <p className="text-sm text-gray-600">
                  Total spent: ${review.receipt_data.total_amount}
                </p>
              )}
              <div className="flex justify-between items-center mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateVoucherEmail(review)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Generate Voucher Email
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Voucher Emails</h2>
        <div className="space-y-4">
          {voucherEmails?.map((email) => (
            <div
              key={email.id}
              className="border rounded-lg p-4 space-y-2 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{email.email_subject}</p>
                {email.recipient_email && (
                  <p className="text-sm text-gray-600">
                    To: {email.recipient_email}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Voucher Code: {email.voucher_code}
              </p>
              <p className="text-sm">{email.email_content}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-4 h-4" />
                {email.scheduled_for 
                  ? `Scheduled for: ${new Date(email.scheduled_for).toLocaleDateString()}`
                  : 'Not scheduled'}
              </div>
              <p className="text-xs text-gray-500">
                Created: {new Date(email.created_at).toLocaleDateString()}
                {email.sent_at && ` • Sent: ${new Date(email.sent_at).toLocaleDateString()}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};