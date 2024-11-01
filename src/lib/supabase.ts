import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://pffclosdtaqthdsqdhqr.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZmNsb3NkdGFxdGhkc3FkaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MzIzNjIsImV4cCI6MjA0NjAwODM2Mn0.sCe5TYmCnJhIbaT9g8XsJOVWk8i_GtW7rQcGK82xgCw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
