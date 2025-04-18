import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/types/supabase'

let supabase: ReturnType<typeof createClientComponentClient<Database>> | undefined

const getSupabaseBrowserClient = () => {
  if (!supabase) {
    supabase = createClientComponentClient<Database>()
  }
  return supabase
}

export default getSupabaseBrowserClient 