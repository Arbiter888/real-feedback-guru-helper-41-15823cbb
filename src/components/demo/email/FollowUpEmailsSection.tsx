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

interface FollowUpEmailsSectionProps {
  restaurantInfo: RestaurantInfo;
}

export const FollowUpEmailsSection = ({ restaurantInfo }: FollowUpEmailsSectionProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["recentReviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
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
    setIsGenerating(true);
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

  const handleSendEmail = async () => {
    toast({
      title: "Email scheduled",
      description: "The follow-up email has been scheduled to be sent.",
    });
  };

  if (isLoadingReviews) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Follow-up Emails</h3>
      </div>

      <div className="grid gap-4">
        {reviews?.map((review) => (
          <div key={review.id} className="space-y-4">
            <ReviewCard
              review={review}
              onGenerateFollowUp={handleGenerateFollowUp}
              isGenerating={isGenerating}
              selectedReviewId={selectedReviewId}
            />

            {selectedReviewId === review.id && followUpEmails?.map((email) => (
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
          <div className="text-center py-8 text-muted-foreground">
            No reviews available yet.
          </div>
        )}
      </div>
    </div>
  );
};