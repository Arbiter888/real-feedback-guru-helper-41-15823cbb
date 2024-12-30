import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://xygmqhxlnwjrgxvbzcyb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Z21xaHhsbndqcmd4dmJ6Y3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5NTU2MDAsImV4cCI6MjAxOTUzMTYwMH0.hB_OZoEKEeYQWServgX_8pzGA3hBcHhVkBfNm9yE3Qk';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'supabase.auth.token',
      storage: window.localStorage,
      detectSessionInUrl: true,
    },
  }
);