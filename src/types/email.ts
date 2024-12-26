import { Json } from "@/integrations/supabase/types";

export interface ReviewMetadata {
  initial_review?: string | null;
  refined_review?: string | null;
  receipt_analysis?: {
    total_amount: number;
    items: Array<{ name: string; price: number }>;
  } | null;
  server_name?: string | null;
  reward_code?: string | null;
  google_maps_url?: string | null;
  restaurant_name?: string | null;
  submission_date?: string | null;
  review_steps_completed?: {
    initial_thoughts: boolean;
    receipt_uploaded: boolean;
    review_enhanced: boolean;
    copied_to_google: boolean;
  };
}

export interface EmailContact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  list_id: string;
  metadata: ReviewMetadata | Json;
}

export const isReviewMetadata = (metadata: any): metadata is ReviewMetadata => {
  return (
    typeof metadata === 'object' &&
    metadata !== null &&
    (
      'initial_review' in metadata ||
      'refined_review' in metadata ||
      'receipt_analysis' in metadata ||
      'server_name' in metadata ||
      'reward_code' in metadata ||
      'google_maps_url' in metadata ||
      'restaurant_name' in metadata ||
      'submission_date' in metadata ||
      'review_steps_completed' in metadata
    )
  );
};

export const isReceiptAnalysis = (value: any): value is { total_amount: number; items: Array<{ name: string; price: number }> } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.total_amount === 'number' &&
    Array.isArray(value.items) &&
    value.items.every((item: any) =>
      typeof item === 'object' &&
      item !== null &&
      typeof item.name === 'string' &&
      typeof item.price === 'number'
    )
  );
};