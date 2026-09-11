import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_ID = 'pqynnzeyphgwpwctvcjw';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const DEFAULT_SUPABASE_KEY = 'sb_publishable_MSmfQAsGn1qsmSNOHLUNCQ_yWoQl0eu';

export const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_KEY || DEFAULT_SUPABASE_KEY;

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
}

export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  error?: string;
}> {
  try {
    const client = getSupabase();
    // Test connection with a lightweight probe
    const { data, error } = await client.from('_probe_test').select('*').limit(1);
    
    // In Supabase, if the table doesn't exist, it still returns a 404/PGRST204/PGRST116 which confirms
    // network connectivity and valid authentication with the Supabase API Gateway!
    if (error && error.code !== 'PGRST204' && error.code !== 'PGRST116' && error.code !== '42P01') {
      // If error is unauthorized or invalid key:
      if (error.message && (error.message.includes('JWT') || error.message.includes('apikey'))) {
        return {
          connected: false,
          projectId: SUPABASE_PROJECT_ID,
          url: supabaseUrl,
          error: error.message,
        };
      }
    }

    return {
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      url: supabaseUrl,
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      url: supabaseUrl,
      error: err.message || 'Failed to connect to Supabase endpoint',
    };
  }
}
