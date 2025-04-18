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
    await supabase.auth.exchangeCodeForSession(code)

    // After exchanging code for session, redirect to onboarding
    // The middleware will check if they need onboarding or can go to dashboard
    const response = NextResponse.redirect(new URL('/onboarding', request.url))
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    return response

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 