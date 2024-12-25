import { Card } from "@/components/ui/card";
import { ReviewList } from "./ReviewList";
import { VoucherEmailList } from "./VoucherEmailList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const VoucherManagementSection = () => {
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
          <ReviewList reviews={reviews || []} />
        </TabsContent>
        <TabsContent value="vouchers" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            View and manage generated voucher emails scheduled for delivery.
          </p>
          <VoucherEmailList voucherEmails={voucherEmails || []} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};