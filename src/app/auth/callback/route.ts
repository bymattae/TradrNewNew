import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(new URL('/onboarding', request.url))
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 