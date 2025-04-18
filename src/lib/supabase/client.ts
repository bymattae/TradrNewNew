import { createBrowserClient } from '@supabase/ssr'

const createClient = () => {
  return createBrowserClient(
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
}

// Create a singleton instance
const supabase = createClient()
export { supabase, createClient } 