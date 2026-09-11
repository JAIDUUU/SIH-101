import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder-project.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key'
);
