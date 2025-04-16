import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/join?error=${error_description}`, request.url)
    )
  }

  if (code) {
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        // Get the user session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // Check if user has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          // If no profile exists, redirect to onboarding
          if (!profile) {
            return NextResponse.redirect(new URL('/auth/verify', request.url))
          }

          // If profile exists, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      // Handle error case
      const errorMessage = error?.message || 'An error occurred during authentication'
      return NextResponse.redirect(
        new URL(`/auth/join?error=${errorMessage}`, request.url)
      )
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred during authentication'
      return NextResponse.redirect(
        new URL(`/auth/join?error=${errorMessage}`, request.url)
      )
    }
  }

  // Return to auth page if code exchange fails
  return NextResponse.redirect(new URL('/auth/join', request.url))
} 