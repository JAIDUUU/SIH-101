import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'pqynnzeyphgwpwctvcjw';
export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_MSmfQAsGn1qsmSNOHLUNCQ_yWoQl0eu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
