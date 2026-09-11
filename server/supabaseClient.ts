import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabaseProjectId = process.env.SUPABASE_PROJECT_ID || '';
export const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  (supabaseProjectId ? `https://${supabaseProjectId}.supabase.co` : '');

export const supabaseKey =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export function getProjectId(): string {
  if (supabaseProjectId) return supabaseProjectId;
  if (supabaseUrl) {
    try {
      const parsed = new URL(supabaseUrl);
      return parsed.hostname.split('.')[0] || 'configured-instance';
    } catch {
      return 'configured-instance';
    }
  }
  return 'not-configured';
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
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
  const projectId = getProjectId();
  if (!supabaseUrl || !supabaseKey) {
    return {
      connected: false,
      projectId,
      url: supabaseUrl || 'Not configured',
      error: 'SUPABASE_URL or SUPABASE_KEY environment variable is not set',
    };
  }

  try {
    const client = getSupabase();
    if (!client) {
      return {
        connected: false,
        projectId,
        url: supabaseUrl,
        error: 'Supabase client could not be initialized',
      };
    }
    const { error } = await client.from('_probe_test').select('*').limit(1);

    if (error && error.code !== 'PGRST204' && error.code !== 'PGRST116' && error.code !== '42P01') {
      if (error.message && (error.message.includes('JWT') || error.message.includes('apikey'))) {
        return {
          connected: false,
          projectId,
          url: supabaseUrl,
          error: error.message,
        };
      }
    }

    return {
      connected: true,
      projectId,
      url: supabaseUrl,
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId,
      url: supabaseUrl,
      error: err.message || 'Failed to connect to Supabase endpoint',
    };
  }
}
