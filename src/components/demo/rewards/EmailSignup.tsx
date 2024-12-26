import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewMetadata } from "@/types/email";
import { Json } from "@/integrations/supabase/types";

interface EmailSignupProps {
  rewardCode: string | null;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
}

export const EmailSignup = ({ 
  rewardCode,
  customGoogleMapsUrl,
  customRestaurantName 
}: EmailSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to sign up.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the review data from localStorage
      const reviewDataString = localStorage.getItem('reviewData');
      console.log('Raw review data:', reviewDataString); // Debug log

      if (!reviewDataString) {
        throw new Error('No review data found');
      }

      const reviewInfo = JSON.parse(reviewDataString);
      console.log('Parsed review info:', reviewInfo); // Debug log

      const { reviewText, refinedReview, analysisResult, serverName } = reviewInfo;

      // Check if reviewText exists and is not empty after trimming
      if (!reviewText?.trim()) {
        throw new Error('Please complete your review before signing up');
      }

      // Format the metadata according to our ReviewMetadata type
      const metadata: ReviewMetadata = {
        initial_review: reviewText.trim(),
        refined_review: refinedReview?.trim() || null,
        receipt_analysis: analysisResult ? {
          total_amount: analysisResult.total_amount || 0,
          items: analysisResult.items?.map((item: any) => ({
            name: String(item.name || ''),
            price: Number(item.price || 0)
          })) || []
        } : null,
        server_name: serverName?.trim() || null,
        reward_code: rewardCode || null,
        google_maps_url: customGoogleMapsUrl || null,
        restaurant_name: customRestaurantName || null,
        submission_date: new Date().toISOString()
      };

      console.log('Metadata being saved:', metadata);

      // First, get or create the restaurant's email list
      const { data: listData, error: listError } = await supabase
        .rpc('get_or_create_restaurant_email_list', {
          restaurant_name: customRestaurantName || "The Local Kitchen & Bar"
        });

      if (listError) throw listError;

      // Convert ReviewMetadata to Json type before inserting
      const jsonMetadata = metadata as unknown as Json;

      // Add the email to the list with review data in metadata
      const { error: contactError } = await supabase
        .from('email_contacts')
        .insert({
          list_id: listData,
          email: email,
          metadata: jsonMetadata
        });

      if (contactError) throw contactError;

      // Create a review entry that will show up in the Latest Reviews section
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          review_text: reviewText.trim(),
          refined_review: refinedReview?.trim() || '',
          receipt_data: analysisResult || null,
          server_name: serverName?.trim() || null,
          business_name: customRestaurantName || "The Local Kitchen & Bar",
          unique_code: rewardCode || '',
          status: 'submitted'
        });

      if (reviewError) throw reviewError;

      toast({
        title: "Success!",
        description: "Thank you for signing up! Your review has been submitted.",
      });

      // Clear the form
      setEmail("");

    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-3">
        <Gift className="h-8 w-8 text-[#E94E87]" />
        <h3 className="font-bold text-2xl bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] text-transparent bg-clip-text">
          Join Our Mailing List! 🎁
        </h3>
      </div>

      <div className="space-y-6">
        <p className="text-center text-gray-600 text-lg">
          Sign up to our mailing list and EatUP! rewards to receive exclusive offers and updates
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <Button 
            onClick={handleEmailSignup}
            disabled={isLoading || !email}
            className="w-full h-12 px-8 bg-gradient-to-r from-[#E94E87] via-[#FF6B9C] to-[#FF9B9B] hover:opacity-90 text-white rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing up...</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>Sign Up to Our Mailing List</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};