import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Mail, MessageSquare, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomerDetailsProps {
  customer: any;
  restaurantInfo: {
    restaurantName: string;
    googleMapsUrl: string;
    contactEmail: string;
    websiteUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    phoneNumber: string;
    bookingUrl: string;
    preferredBookingMethod: 'phone' | 'website';
  };
}

export const CustomerDetails = ({ customer, restaurantInfo }: CustomerDetailsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateFollowUp = async () => {
    if (!customer?.reviews?.[0]?.id) {
      toast({
        title: "No review found",
        description: "Cannot generate follow-up email without a review.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-follow-up", {
        body: { reviewId: customer.reviews[0].id },
      });

      if (error) throw error;

      toast({
        title: "Follow-up email generated",
        description: "The follow-up email has been scheduled.",
      });
    } catch (error) {
      console.error("Error generating follow-up:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate follow-up email.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{customer.email}</h2>
          {customer.firstName && customer.lastName && (
            <p className="text-muted-foreground">
              {customer.firstName} {customer.lastName}
            </p>
          )}
        </div>
        <Button onClick={handleGenerateFollowUp} disabled={isGenerating}>
          <Mail className="mr-2 h-4 w-4" />
          Generate Follow-up
        </Button>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <div className="space-y-4">
            {customer.reviews?.map((review: any) => (
              <Card key={review.id} className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {formatDistanceToNow(new Date(review.created_at), {
                    addSuffix: true,
                  })}
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Initial Review:</p>
                  <p className="text-muted-foreground">{review.review_text}</p>
                </div>

                {review.refined_review && (
                  <div className="space-y-2">
                    <p className="font-medium">Enhanced Review:</p>
                    <p className="text-muted-foreground">{review.refined_review}</p>
                  </div>
                )}

                {review.receipt_data && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      <p className="font-medium">Receipt Details:</p>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-lg">
                      <p>Total: ${review.receipt_data.total_amount}</p>
                      <div className="mt-2 space-y-1">
                        {review.receipt_data.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>${item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {(!customer.reviews || customer.reviews.length === 0) && (
              <p className="text-center text-muted-foreground py-4">
                No reviews found for this customer
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="interactions">
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Email Interactions</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  First Contact: {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
                </p>
                {customer.metadata?.lastInteraction && (
                  <p className="text-sm text-muted-foreground">
                    Last Interaction: {formatDistanceToNow(new Date(customer.metadata.lastInteraction), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};