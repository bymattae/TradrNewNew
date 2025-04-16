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

    // Always redirect to verify page after successful auth
    return NextResponse.redirect(new URL('/auth/verify', request.url))
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 