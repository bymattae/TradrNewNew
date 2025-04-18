import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (!code) {
    console.error('No code found in callback URL')
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    // Get the session to verify it was created
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.error('No session created after code exchange')
      return NextResponse.redirect(new URL('/auth/join', request.url))
    }

    console.log('Successfully exchanged code for session, redirecting to verify page')
    return NextResponse.redirect(new URL('/auth/verify', request.url))
  } catch (error) {
    console.error('Unexpected error in callback:', error)
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }
} 