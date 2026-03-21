import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// IMPORTANT: Never create clients at module scope — only inside functions
// This prevents build-time crashes when env vars are not present

export function getSupabase(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not set')
  return createClient<Database>(url, key)
}

// Alias for backwards compatibility
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  auth: {
    getUser: () => getSupabase().auth.getUser(),
    signInWithPassword: (creds: any) => getSupabase().auth.signInWithPassword(creds),
    signOut: () => getSupabase().auth.signOut(),
  },
  storage: { from: (bucket: string) => getSupabase().storage.from(bucket) },
}

export function supabaseAdmin(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service role env vars not set')
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
