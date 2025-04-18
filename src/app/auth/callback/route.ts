import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    // If no code in URL, redirect to join
    if (!code) {
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    // Check if user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()

    // If error checking profile or no profile exists, send to onboarding
    if (profileError || !profile) {
      const response = NextResponse.redirect(new URL('/onboarding', request.url))
      // Add cache headers to prevent caching
      response.headers.set('Cache-Control', 'no-store, max-age=0')
      return response
    }

    // If they have a profile, send to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    return response

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 