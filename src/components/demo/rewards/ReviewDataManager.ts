import { supabase } from "@/integrations/supabase/client";

export interface ReviewData {
  reviewText: string;
  refinedReview?: string;
  analysisResult?: any;
  serverName?: string;
  rewardCode: string;
  googleMapsUrl?: string;
  restaurantName?: string;
  restaurantInfo?: any;
  reviewRewardAmount?: number;
  tipRewardPercentage?: number;
}

export const saveReviewData = async (
  email: string,
  listId: string,
  reviewData: ReviewData
) => {
  try {
    // If email is provided, save contact
    if (email && listId) {
      const { error: contactError } = await supabase
        .from('email_contacts')
        .upsert(
          {
            list_id: listId,
            email: email,
            metadata: {
              reviews: [
                {
                  text: reviewData.reviewText,
                  refined: reviewData.refinedReview,
                  analysis: reviewData.analysisResult,
                  server: reviewData.serverName,
                  reward_code: reviewData.rewardCode,
                  submitted_at: new Date().toISOString()
                }
              ]
            }
          },
          {
            onConflict: 'list_id,email'
          }
        );

      if (contactError) throw contactError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving review data:', error);
    throw error;
  }
};