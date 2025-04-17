import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    if (!data.session) {
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

    return response

  } catch (error) {
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 