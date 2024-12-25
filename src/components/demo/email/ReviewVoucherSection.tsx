import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { ReviewList } from "./vouchers/ReviewList";
import { VoucherEmailList } from "./vouchers/VoucherEmailList";

type DbReview = Database['public']['Tables']['reviews']['Row'];

export interface Review {
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

export interface VoucherEmail {
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
        <ReviewList 
          reviews={reviews || []} 
          onGenerateVoucher={generateVoucherEmail}
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Voucher Emails</h2>
        <VoucherEmailList voucherEmails={voucherEmails || []} />
      </div>
    </div>
  );
};