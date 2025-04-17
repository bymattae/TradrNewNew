import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Auth callback started - URL:', request.url)
  console.log('Code present:', !!code)

  if (!code) {
    console.log('No code found in URL, redirecting to /auth/join')
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  try {
    const cookieStore = cookies()
    const supabase = createClient()
    
    console.log('Exchanging code for session...')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Exchange code error:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    if (!data.session) {
      console.error('No session data received')
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    console.log('Session obtained successfully')
    console.log('Access token present:', !!data.session.access_token)
    console.log('Refresh token present:', !!data.session.refresh_token)

    // Create response with redirect to onboarding
    const response = NextResponse.redirect(
      new URL('/onboarding', request.url)
    )

    // Set all required cookies
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    }

    console.log('Setting cookies...')
    
    // Set Supabase cookies
    response.cookies.set('sb-access-token', data.session.access_token, cookieOptions)
    response.cookies.set('sb-refresh-token', data.session.refresh_token!, cookieOptions)

    // Set additional session cookie
    response.cookies.set(
      'sb-auth-token',
      JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week from now
      }),
      cookieOptions
    )

    console.log('Setting client session...')
    // Ensure the session is set in the client
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token!
    })

    console.log('Returning response with redirect to /onboarding')
    return response

  } catch (error) {
    console.error('Unexpected error in callback:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 