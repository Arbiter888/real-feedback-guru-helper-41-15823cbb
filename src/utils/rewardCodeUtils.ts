import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';

export const generateUniqueRewardCode = async (retries = 3): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    const code = nanoid(8);
    
    // Check if code exists
    const { data } = await supabase
      .from('reviews')
      .select('unique_code')
      .eq('unique_code', code)
      .single();
    
    if (!data) {
      return code; // Code is unique, return it
    }
    
    console.log(`Code collision detected (attempt ${i + 1}/${retries}), generating new code...`);
  }
  
  throw new Error('Unable to generate unique code after multiple attempts');
};