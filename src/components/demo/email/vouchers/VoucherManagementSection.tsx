import { Card } from "@/components/ui/card";
import { ReviewList } from "./ReviewList";
import { VoucherEmailList } from "./VoucherEmailList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Review } from "../ReviewVoucherSection";
import { useToast } from "@/hooks/use-toast";

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

interface VoucherManagementSectionProps {
  restaurantInfo?: RestaurantInfo;
}

export const VoucherManagementSection = ({ restaurantInfo }: VoucherManagementSectionProps) => {
  const { toast } = useToast();

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((review: any) => ({
        ...review,
        receipt_data: review.receipt_data ? {
          total_amount: review.receipt_data.total_amount || 0,
          items: review.receipt_data.items || []
        } : null
      })) as Review[];
    },
  });

  const { data: voucherEmails, isLoading: isLoadingVouchers } = useQuery({
    queryKey: ["voucher_emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_voucher_emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
    return <div className="text-center py-8">Loading voucher data...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Review-Based Vouchers</h2>
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
          <TabsTrigger value="vouchers">Generated Vouchers</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Generate personalized vouchers based on customer reviews and spending patterns.
          </p>
          <ReviewList 
            reviews={reviews || []} 
            onGenerateVoucher={generateVoucherEmail}
          />
        </TabsContent>
        <TabsContent value="vouchers" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            View and manage generated voucher emails scheduled for delivery.
          </p>
          <VoucherEmailList 
            voucherEmails={voucherEmails || []} 
            restaurantInfo={restaurantInfo}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};