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

interface ReceiptData {
  total_amount: number;
  items: Array<{ name: string; price: number }>;
}

interface Review {
  id: string;
  review_text: string;
  refined_review?: string;
  created_at: string;
  server_name?: string;
  receipt_data?: ReceiptData;
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

      // Transform the data to ensure it matches the Review interface
      return data.map((review): Review => ({
        id: review.id,
        review_text: review.review_text,
        refined_review: review.refined_review || undefined,
        created_at: review.created_at,
        server_name: review.server_name || undefined,
        receipt_data: review.receipt_data as ReceiptData | undefined,
      }));
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
              selectedReviewId={selectedReviewId}
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