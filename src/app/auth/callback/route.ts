import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  try {
    const cookieStore = cookies()
    const supabase = createClient()
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.session) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

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

    // Ensure the session is set in the client
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token!
    })

    return response

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 