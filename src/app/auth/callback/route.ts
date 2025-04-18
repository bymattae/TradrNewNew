import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    if (!code) {
      console.error('No code provided in callback')
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    const supabase = createRouteHandlerClient({ cookies })

    try {
      // Exchange the code for a session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError)
        return NextResponse.redirect(new URL('/auth/join', request.url))
      }

      // Check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Profile check error:', profileError)
        return NextResponse.redirect(new URL('/auth/join', request.url))
      }

      // If no profile exists, redirect to onboarding
      if (!profile) {
        const response = NextResponse.redirect(new URL('/onboarding', request.url))
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
        return response
      }

      // If profile exists, redirect to dashboard
      const response = NextResponse.redirect(new URL('/dashboard', request.url))
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response

    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 