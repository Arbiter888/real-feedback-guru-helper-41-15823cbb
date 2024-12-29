import { Json } from "@/integrations/supabase/types";

export interface CustomerMetadata {
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
  restaurant_visit_date?: string;
  review_steps_completed?: {
    initial_thoughts: boolean;
    receipt_uploaded: boolean;
    review_enhanced: boolean;
    copied_to_google: boolean;
    initial_thoughts_at?: string;
    receipt_uploaded_at?: string;
    review_enhanced_at?: string;
    copied_to_google_at?: string;
  };
}

export interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  list_id: string;
  metadata: CustomerMetadata | Json;
}

// Type guard to check if an object is CustomerMetadata
export function isCustomerMetadata(obj: any): obj is CustomerMetadata {
  return obj && (
    typeof obj.initial_review === 'string' ||
    typeof obj.refined_review === 'string' ||
    typeof obj.server_name === 'string' ||
    obj.receipt_data !== undefined ||
    obj.review_steps_completed !== undefined
  );
}