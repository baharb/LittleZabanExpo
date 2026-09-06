// Supabase client for the "send verification code" (parent email/phone OTP)
// flow used by AccountSetupScreen. Everything else in the app stays fully
// local (AsyncStorage) — this client is only used to prove the parent owns
// the email/phone they typed in, nothing else is synced to Supabase.
//
// EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY come from your
// Supabase project's Settings -> API page. Put real values in a ".env" file
// at the project root (see ".env.example") — Expo inlines EXPO_PUBLIC_* vars
// into the bundle automatically, no extra config needed.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Don't throw at import time (that would crash the whole app on launch for
// screens that never touch this file) — surface it lazily instead, the
// first time something actually tries to send a code.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
