import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const returnTo = requestUrl.searchParams.get('returnTo') || '/onboarding'

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
        return NextResponse.redirect(new URL(returnTo, request.url))
      }
      console.error('Exchange error:', error)
      return NextResponse.redirect(
        new URL(`/auth/join?error=${error.message}`, request.url)
      )
    } catch (error: any) {
      console.error('Exchange error:', error)
      return NextResponse.redirect(
        new URL(`/auth/join?error=${error.message}`, request.url)
      )
    }
  }

  // Return to auth page if code exchange fails
  return NextResponse.redirect(new URL('/auth/join', request.url))
} 