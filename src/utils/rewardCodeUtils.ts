import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';

export const generateUniqueRewardCode = async (retries = 3): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    try {
      const code = nanoid(8).toUpperCase();
      
      // Check if code exists in reviews table
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('unique_code')
        .eq('unique_code', code)
        .maybeSingle();
      
      if (!existingReview) {
        return code; // Code is unique, return it
      }
      
      console.log(`Code collision detected (attempt ${i + 1}/${retries}), generating new code...`);
    } catch (error) {
      console.error('Error checking code uniqueness:', error);
      if (i === retries - 1) {
        throw new Error('Unable to generate unique code after multiple attempts');
      }
    }
  }
  
  throw new Error('Unable to generate unique code after multiple attempts');
};