import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EmailPreview } from "./EmailPreview";
import { Loader2, Wand2 } from "lucide-react";

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

export const FollowUpEmailsSection = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: followUpEmails, isLoading } = useQuery({
    queryKey: ["followUpEmails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follow_up_emails")
        .select("*, reviews(*)")
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data as FollowUpEmail[];
    },
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

  if (isLoading) {
    return <div className="text-center py-8">Loading follow-up emails...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Follow-up Emails</h3>
        <Button
          onClick={() => handleGenerateFollowUp("some-review-id")}
          disabled={isGenerating}
        >
          {isGenerating ? (
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

      <div className="grid gap-4">
        {followUpEmails?.map((email) => (
          <div
            key={email.id}
            className="bg-white/50 rounded-lg p-4 border space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{email.email_subject}</h4>
                <p className="text-sm text-muted-foreground">
                  Scheduled for: {new Date(email.scheduled_for).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {email.status}
                </p>
              </div>
            </div>
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
                <h5 className="font-medium text-sm mb-1">Voucher Details</h5>
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(email.voucher_details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}

        {!followUpEmails?.length && (
          <div className="text-center py-8 text-muted-foreground">
            No follow-up emails scheduled yet.
          </div>
        )}
      </div>
    </div>
  );
};