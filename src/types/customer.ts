import { Json } from "@/integrations/supabase/types";
import { TipMetadata } from "./tip";

export interface CustomerMetadata {
  reviews?: Record<string, {
    review_text: string;
    refined_review?: string;
    server_name?: string;
    receipt_data?: {
      total_amount: number;
      items: Array<{
        name: string;
        price: number;
      }>;
    };
    created_at: string;
    steps_metadata?: {
      steps: {
        initial_thoughts: boolean;
        receipt_uploaded: boolean;
        review_enhanced: boolean;
        copied_to_google: boolean;
      };
    };
  }>;
  tips?: TipMetadata;
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

export function isCustomerMetadata(obj: any): obj is CustomerMetadata {
  return obj && (
    typeof obj.reviews === 'object' ||
    typeof obj.tips === 'object'
  );
}