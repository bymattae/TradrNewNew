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
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    // Get the session to verify it worked
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

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

    // If profile exists, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 