import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    if (session) {
      // Check if user has a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      // If no profile exists, redirect to onboarding
      if (!profile) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }

  // If profile exists or no code, redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
} 