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
      sameSite: 'lax' as const
    }

    // Set Supabase cookies
    response.cookies.set('sb-access-token', data.session.access_token, cookieOptions)
    response.cookies.set('sb-refresh-token', data.session.refresh_token!, cookieOptions)

    return response

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 