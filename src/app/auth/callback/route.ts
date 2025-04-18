import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // If no code present, redirect to join page
  if (!code) {
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) throw exchangeError

    // Get the session after exchange
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    // If we have a session, redirect to onboarding
    if (session) {
      const response = NextResponse.redirect(new URL('/onboarding', request.url))
      
      // Set cache headers to prevent caching
      response.headers.set('Cache-Control', 'no-store, max-age=0')
      response.headers.set('Pragma', 'no-cache')
      
      return response
    }

    // If no session, redirect to join
    return NextResponse.redirect(new URL('/auth/join', request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    // On any error, safely redirect to join
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 