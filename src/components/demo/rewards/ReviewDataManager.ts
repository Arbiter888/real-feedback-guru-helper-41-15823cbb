import { supabase } from "@/integrations/supabase/client";
import { ReviewMetadata } from "@/types/email";
import { Json } from "@/integrations/supabase/types";

export const saveReviewData = async (
  email: string,
  listId: string,
  reviewData: {
    reviewText: string;
    refinedReview?: string;
    analysisResult?: any;
    serverName?: string;
    rewardCode: string;
    googleMapsUrl?: string;
    restaurantName?: string;
  }
) => {
  const now = new Date().toISOString();
  const stepsMetadata = {
    steps: {
      initial_thoughts: !!reviewData.reviewText,
      receipt_uploaded: !!reviewData.analysisResult,
      review_enhanced: !!reviewData.refinedReview,
      copied_to_google: true // Since rewardCode exists
    }
  };

  // Create review entry
  const { data: reviewData_, error: reviewError } = await supabase
    .from('reviews')
    .insert({
      review_text: reviewData.reviewText,
      refined_review: reviewData.refinedReview,
      receipt_data: reviewData.analysisResult,
      server_name: reviewData.serverName,
      business_name: reviewData.restaurantName || "The Local Kitchen & Bar",
      unique_code: reviewData.rewardCode,
      status: 'submitted',
      steps_metadata: stepsMetadata,
      initial_thoughts_completed_at: reviewData.reviewText ? now : null,
      receipt_uploaded_at: reviewData.analysisResult ? now : null,
      review_enhanced_at: reviewData.refinedReview ? now : null,
      review_copied_at: now
    })
    .select()
    .single();

  if (reviewError) throw reviewError;

  // Create or update email contact
  const metadata: ReviewMetadata = {
    initial_review: reviewData.reviewText,
    refined_review: reviewData.refinedReview,
    receipt_analysis: reviewData.analysisResult,
    server_name: reviewData.serverName,
    reward_code: reviewData.rewardCode,
    google_maps_url: reviewData.googleMapsUrl,
    restaurant_name: reviewData.restaurantName,
    submission_date: now,
    review_steps_completed: stepsMetadata.steps
  };

  const { error: contactError } = await supabase
    .from('email_contacts')
    .upsert({
      list_id: listId,
      email: email,
      metadata: metadata as unknown as Json
    });

  if (contactError) throw contactError;

  return reviewData_;
};