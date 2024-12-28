export interface ReviewMetadata {
  initial_review?: string;
  refined_review?: string;
  receipt_analysis?: ReceiptData;
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

export interface ReceiptData {
  total_amount: number;
  items: Array<{
    name: string;
    price: number;
  }>;
}

export interface EmailContact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  metadata: ReviewMetadata | null;
}

// Type guard to check if an object is ReviewMetadata
export function isReviewMetadata(obj: any): obj is ReviewMetadata {
  return obj && (
    typeof obj.initial_review === 'string' ||
    typeof obj.refined_review === 'string' ||
    typeof obj.server_name === 'string' ||
    typeof obj.reward_code === 'string' ||
    typeof obj.restaurant_name === 'string'
  );
}

// Type guard to check if an object is ReceiptData
export function isReceiptData(obj: any): obj is ReceiptData {
  return obj && 
    typeof obj.total_amount === 'number' && 
    Array.isArray(obj.items) &&
    obj.items.every((item: any) => 
      typeof item.name === 'string' && 
      typeof item.price === 'number'
    );
}