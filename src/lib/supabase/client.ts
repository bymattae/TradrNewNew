import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = (): ReturnType<typeof createSupabaseClient> => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient() 