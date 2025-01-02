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
  // Add direct access properties for the latest review
  initial_review?: string;
  refined_review?: string;
  receipt_data?: {
    total_amount: number;
    items: Array<{
      name: string;
      price: number;
    }>;
  };
  receipt_analysis?: any;
  server_name?: string;
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
  if (!obj) return false;
  
  // Check if it's a valid metadata object
  return (
    typeof obj === 'object' &&
    (
      // Has reviews or tips
      (typeof obj.reviews === 'object' || typeof obj.tips === 'object') ||
      // Or has direct review properties
      typeof obj.initial_review === 'string' ||
      typeof obj.refined_review === 'string' ||
      typeof obj.receipt_data === 'object' ||
      typeof obj.server_name === 'string'
    )
  );
}