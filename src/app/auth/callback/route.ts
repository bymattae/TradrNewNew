import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Callback URL:', requestUrl.toString())
  console.log('Code present:', !!code)
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Session exchange result:', { session: !!session, error: error?.message })
      
      if (error) {
        throw error
      }

      if (session) {
        const redirectUrl = new URL('/onboarding', request.url)
        console.log('Redirecting to:', redirectUrl.toString())
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Error exchanging code for session:', error)
    }
  }

  const redirectUrl = new URL('/auth/join', request.url)
  console.log('Redirecting to join:', redirectUrl.toString())
  return NextResponse.redirect(redirectUrl)
} 