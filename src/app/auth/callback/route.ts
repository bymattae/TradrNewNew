import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    // Exchange the code and wait for session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error || !session) {
      console.error('Session error:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    // Check if user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()

    // Decide where to send them based on profile
    const redirectTo = profile ? '/dashboard' : '/onboarding'
    const response = NextResponse.redirect(new URL(redirectTo, request.url))
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    return response

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 