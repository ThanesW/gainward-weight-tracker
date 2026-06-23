import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Fail loudly in dev rather than silently making requests that 404.
  console.error(
    'Missing Supabase env vars. Copy .env.example to .env.local and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.'
  );
}

// createClient() throws synchronously if the URL is missing/malformed, which
// would crash the whole React tree before any error UI gets a chance to
// render. Use harmless placeholder values in that case — every call will
// still fail (and be caught) once a real request goes out, but at least
// the app boots far enough to show a helpful setup message.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      // No login in this app — disable session persistence/auth entirely.
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const PHOTOS_BUCKET = 'photos';
