import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookie error silently
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle cookie error silently
            }
          },
        },
      }
    )

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
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