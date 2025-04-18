import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  console.log('Callback route hit');
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Auth code present:', !!code);
  
  if (!code) {
    console.log('No code found, redirecting to /auth/join');
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    console.log('Attempting to exchange code for session');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Exchange result:', { data: !!data, error });
    
    if (error) throw error;
    console.log('Success, redirecting to /onboarding');
    return NextResponse.redirect(new URL('/onboarding', request.url))
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 