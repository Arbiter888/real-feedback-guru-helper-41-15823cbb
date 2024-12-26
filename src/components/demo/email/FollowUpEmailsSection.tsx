import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewCard } from "./ReviewCard";
import { EmailPreviewCard } from "./EmailPreviewCard";

interface RestaurantInfo {
  restaurantName: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  phoneNumber?: string;
  googleMapsUrl?: string;
}

interface ReceiptItem {
  name: string;
  price: number;
}

interface ReceiptData {
  total_amount: number;
  items: ReceiptItem[];
}

interface Review {
  id: string;
  review_text: string;
  server_name: string | null;
  created_at: string;
  receipt_data: ReceiptData | null;
  refined_review?: string;
}

interface FollowUpEmailsSectionProps {
  restaurantInfo: RestaurantInfo;
}

export const FollowUpEmailsSection = ({ restaurantInfo }: FollowUpEmailsSectionProps) => {
  const { toast } = useToast();
  const [generatingReviewId, setGeneratingReviewId] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [visibleEmailPreviews, setVisibleEmailPreviews] = useState<Set<string>>(new Set());

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["recentReviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Transform and type-check the receipt_data
      return (data as any[]).map(review => ({
        ...review,
        receipt_data: review.receipt_data ? {
          total_amount: typeof review.receipt_data.total_amount === 'number' 
            ? review.receipt_data.total_amount 
            : 0,
          items: Array.isArray(review.receipt_data.items)
            ? review.receipt_data.items.map((item: any) => ({
                name: String(item.name || ''),
                price: typeof item.price === 'number' ? item.price : 0
              }))
            : []
        } : null
      })) as Review[];
    },
  });

  const { data: followUpEmails } = useQuery({
    queryKey: ["followUpEmails", selectedReviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follow_up_emails")
        .select("*")
        .eq("review_id", selectedReviewId)
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedReviewId,
  });

  const handleGenerateFollowUp = async (reviewId: string) => {
    setGeneratingReviewId(reviewId);
    try {
      const { data, error } = await supabase.functions.invoke("generate-follow-up", {
        body: { reviewId },
      });

      if (error) throw error;

      toast({
        title: "Follow-up email generated",
        description: "The follow-up email has been scheduled.",
      });
      
      setSelectedReviewId(reviewId);
      setVisibleEmailPreviews(prev => new Set([...prev, reviewId]));
    } catch (error) {
      console.error("Error generating follow-up:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate follow-up email.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReviewId(null);
    }
  };

  const toggleEmailPreview = (reviewId: string) => {
    setVisibleEmailPreviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleSendEmail = async () => {
    toast({
      title: "Email scheduled",
      description: "The follow-up email has been scheduled to be sent.",
    });
  };

  if (isLoadingReviews) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Latest Reviews & Follow-up Emails</h3>
        </div>
        <div className="text-center py-8">Loading latest reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Latest Reviews & Follow-up Emails</h3>
          <p className="text-sm text-muted-foreground">
            Generate personalized follow-up emails for your most recent reviews
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {reviews?.map((review) => (
          <div key={review.id} className="space-y-4">
            <ReviewCard
              review={review}
              onGenerateFollowUp={handleGenerateFollowUp}
              isGenerating={generatingReviewId === review.id}
              onTogglePreview={() => toggleEmailPreview(review.id)}
              showPreview={visibleEmailPreviews.has(review.id)}
            />

            {visibleEmailPreviews.has(review.id) && followUpEmails?.map((email) => (
              <EmailPreviewCard
                key={email.id}
                email={email}
                onSendEmail={handleSendEmail}
                restaurantInfo={restaurantInfo}
              />
            ))}
          </div>
        ))}

        {!reviews?.length && (
          <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg">
            <p className="text-sm">No reviews available yet.</p>
            <p className="text-xs mt-1">New reviews will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};