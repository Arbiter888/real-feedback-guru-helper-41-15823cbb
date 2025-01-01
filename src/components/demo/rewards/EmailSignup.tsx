import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmailSignupForm } from "./EmailSignupForm";
import { saveReviewData } from "./ReviewDataManager";

interface EmailSignupProps {
  rewardCode: string | null;
  customGoogleMapsUrl?: string;
  customRestaurantName?: string;
  reviewRewardAmount?: number;
}

export const EmailSignup = ({ 
  rewardCode,
  customGoogleMapsUrl,
  customRestaurantName,
  reviewRewardAmount = 10
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

    if (!rewardCode) {
      toast({
        title: "Review not complete",
        description: "Please complete and copy your review to Google before signing up.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const reviewDataString = localStorage.getItem('reviewData');
      console.log('Raw review data:', reviewDataString);

      if (!reviewDataString) {
        throw new Error('No review data found');
      }

      const reviewInfo = JSON.parse(reviewDataString);
      console.log('Parsed review info:', reviewInfo);

      const { reviewText, refinedReview, analysisResult, serverName } = reviewInfo;

      // First, get or create the restaurant's email list
      const { data: listData, error: listError } = await supabase
        .rpc('get_or_create_restaurant_email_list', {
          restaurant_name: customRestaurantName || "The Local Kitchen & Bar"
        });

      if (listError) throw listError;

      // Save review data
      await saveReviewData(email, listData, {
        reviewText: reviewText?.trim() || '',
        refinedReview: refinedReview?.trim(),
        analysisResult,
        serverName: serverName?.trim(),
        rewardCode,
        googleMapsUrl: customGoogleMapsUrl,
        restaurantName: customRestaurantName,
        reviewRewardAmount
      });

      // Get restaurant info from localStorage if available
      const savedRestaurantInfo = localStorage.getItem('restaurantInfo');
      const restaurantInfo = savedRestaurantInfo ? JSON.parse(savedRestaurantInfo) : {};

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          to: email,
          rewardCode,
          restaurantName: customRestaurantName || "The Local Kitchen & Bar",
          googleMapsUrl: customGoogleMapsUrl,
          restaurantInfo,
          reviewRewardAmount
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Success!",
        description: "Thank you for signing up! Check your email for your welcome reward.",
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
    <EmailSignupForm
      email={email}
      setEmail={setEmail}
      onSubmit={handleEmailSignup}
      isLoading={isLoading}
    />
  );
};