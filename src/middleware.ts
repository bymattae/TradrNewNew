import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const path = request.nextUrl.pathname

  // Create response early to handle cookie setting
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Public paths that don't require session checks
  const publicPaths = [
    '/strategy',
    '/auth/join',
    '/auth/login',
    '/auth/callback',
    '/auth/verify',
    '/auth/magic-link-sent'
  ]

  // If it's a public path, allow access
  if (publicPaths.includes(path)) {
    return response
  }

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax'
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            sameSite: 'lax'
          })
        },
      },
    }
  )

  try {
    // Get session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Session error:', error)
      return NextResponse.redirect(new URL('/auth/join', requestUrl))
    }

    // If no session and trying to access protected route, redirect to join
    if (!session && (
      path.startsWith('/dashboard') ||
      path.startsWith('/onboarding') ||
      path.startsWith('/strategy/')
    )) {
      return NextResponse.redirect(new URL('/auth/join', requestUrl))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/auth/join', requestUrl))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 