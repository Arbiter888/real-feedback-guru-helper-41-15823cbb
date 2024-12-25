import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EmailPreview } from "./EmailPreview";
import { Loader2, Wand2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FollowUpEmail {
  id: string;
  review_id: string;
  email_subject: string;
  email_content: string;
  voucher_details: any;
  scheduled_for: string;
  sent_at: string | null;
  status: string;
}

interface Review {
  id: string;
  review_text: string;
  created_at: string;
  server_name: string | null;
  refined_review: string | null;
}

interface VoucherSuggestion {
  id: string;
  review_id: string;
  suggested_vouchers: any[];
  status: string;
}

export const FollowUpEmailsSection = () => {
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
      return data as Review[];
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
      return data as FollowUpEmail[];
    },
    enabled: !!selectedReviewId,
  });

  const { data: voucherSuggestions } = useQuery({
    queryKey: ["voucherSuggestions", selectedReviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_voucher_suggestions")
        .select("*")
        .eq("review_id", selectedReviewId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as VoucherSuggestion;
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

  const getSentimentColor = (review: string) => {
    const lowercaseReview = review.toLowerCase();
    const positiveWords = ['great', 'excellent', 'amazing', 'good', 'love', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointed', 'worst'];
    
    const positiveCount = positiveWords.filter(word => lowercaseReview.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowercaseReview.includes(word)).length;
    
    return positiveCount > negativeCount ? "success" : negativeCount > positiveCount ? "destructive" : "default";
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
          <div
            key={review.id}
            className="bg-white/50 rounded-lg p-4 border space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getSentimentColor(review.review_text)}>
                    {getSentimentColor(review.review_text) === "success" ? (
                      <ThumbsUp className="w-3 h-3 mr-1" />
                    ) : (
                      <ThumbsDown className="w-3 h-3 mr-1" />
                    )}
                    {getSentimentColor(review.review_text) === "success" ? "Positive" : "Needs Attention"}
                  </Badge>
                  {review.server_name && (
                    <Badge variant="outline">Server: {review.server_name}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm">{review.review_text}</p>
              </div>
              <Button
                onClick={() => handleGenerateFollowUp(review.id)}
                disabled={isGenerating}
                size="sm"
              >
                {isGenerating && selectedReviewId === review.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Follow-up
                  </>
                )}
              </Button>
            </div>

            {selectedReviewId === review.id && followUpEmails?.map((email) => (
              <div key={email.id} className="mt-4 pl-4 border-l-2 border-primary/20">
                <h4 className="font-medium text-sm mb-2">Generated Follow-up Email</h4>
                <EmailPreview
                  emailSubject={email.email_subject}
                  htmlContent={email.email_content}
                  showPreview={true}
                  restaurantInfo={{
                    restaurantName: "Restaurant Name", // You should get this from context/props
                    websiteUrl: "",
                    facebookUrl: "",
                    instagramUrl: "",
                    phoneNumber: "",
                    bookingUrl: "",
                    googleMapsUrl: "",
                  }}
                />
                {email.voucher_details && (
                  <div className="bg-primary/5 rounded p-3 mt-2">
                    <h5 className="font-medium text-sm mb-1">Suggested Offer</h5>
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(email.voucher_details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
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