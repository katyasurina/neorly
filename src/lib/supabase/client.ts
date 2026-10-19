import { createBrowserClient } from '@supabase/ssr';

// Placeholder-и дозволяють зібрати проєкт без .env (CI, Vercel preview до встановлення змінних).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const createClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey);
