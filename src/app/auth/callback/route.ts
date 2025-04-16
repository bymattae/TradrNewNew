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

    // Get the user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single()

    // Create response with redirect
    const response = NextResponse.redirect(
      new URL(profile ? '/dashboard' : '/onboarding', request.url)
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

    // Set user cookie for client-side access
    response.cookies.set('sb-user', JSON.stringify(data.session.user), {
      ...cookieOptions,
      httpOnly: false // Allow client-side access
    })

    return response

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 