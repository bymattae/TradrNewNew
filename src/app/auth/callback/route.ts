import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      await supabase.auth.exchangeCodeForSession(code)
      
      // Get the session after exchange
      const { data: { session } } = await supabase.auth.getSession()
      
      // If we have a session, redirect to onboarding
      if (session) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
    
    // If no code or no session, redirect to join
    return NextResponse.redirect(new URL('/auth/join', request.url))
  } catch (error) {
    // On any error, safely redirect to join
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 