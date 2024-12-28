export interface ReviewMetadata {
  initial_review?: string;
  refined_review?: string;
  receipt_data?: {
    total_amount: number;
    items: Array<{
      name: string;
      price: number;
    }>;
  };
  server_name?: string;
  reward_code?: string;
  google_maps_url?: string;
  restaurant_name?: string;
  submission_date?: string;
  review_steps_completed?: {
    initial_thoughts: boolean;
    receipt_uploaded: boolean;
    review_enhanced: boolean;
    copied_to_google: boolean;
  };
}