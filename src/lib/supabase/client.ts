import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/supabase'

let supabase: ReturnType<typeof createBrowserClient<Database>> | undefined

const createClient = () => {
  if (supabase) return supabase

  supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: 'sb-auth',
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      },
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
      }
    }
  )

  return supabase
}

export { createClient }
export default createClient() 