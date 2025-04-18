import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    if (!code) {
      console.error('No code provided in callback')
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    const supabase = createRouteHandlerClient({ cookies })

    try {
      await supabase.auth.exchangeCodeForSession(code)
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        console.error('Session error:', error)
        return NextResponse.redirect(new URL('/auth/join', request.url))
      }

      const response = NextResponse.redirect(new URL('/onboarding', request.url))
      
      // Set strict cache control headers
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')

      return response
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 