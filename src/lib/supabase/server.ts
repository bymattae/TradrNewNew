import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const createClient = () => {
  const cookieStore = cookies()
  
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        'Cookie': cookieStore.getAll()
          .map(cookie => `${cookie.name}=${cookie.value}`)
          .join('; ')
      }
    }
  })
} 