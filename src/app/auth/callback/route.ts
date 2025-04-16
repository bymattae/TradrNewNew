import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  try {
    const supabase = createClient()
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.session) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    // Use the session we just got from the exchange
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single()

    // Create response with redirect
    const response = NextResponse.redirect(
      new URL(profile ? '/dashboard' : '/onboarding', request.url)
    )

    // Set cookie expiry to match session expiry
    const sessionExpiresIn = new Date(data.session.expires_at! * 1000)

    // Set the Supabase cookies
    response.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      expires: sessionExpiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    response.cookies.set('sb-refresh-token', data.session.refresh_token!, {
      path: '/',
      expires: sessionExpiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    // Also set the provider token if it exists
    if (data.session.provider_token) {
      response.cookies.set('sb-provider-token', data.session.provider_token, {
        path: '/',
        expires: sessionExpiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    return response

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 