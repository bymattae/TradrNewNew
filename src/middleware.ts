import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
            sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            sameSite: options.sameSite as 'lax' | 'strict' | 'none' | undefined
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Get the current pathname
  const path = request.nextUrl.pathname

  // Auth-related paths that should always be accessible
  const publicPaths = [
    '/strategy',
    '/auth/verify',
    '/auth/callback',
    '/auth/join',
    '/auth/login',
    '/auth/magic-link-sent'
  ]

  // If the path is public, allow access
  if (publicPaths.includes(path)) {
    return response
  }

  // Protected routes - require auth
  if (!session && (
    path.startsWith('/dashboard') ||
    path.startsWith('/strategy/') || // Only protect nested strategy routes
    path.startsWith('/onboarding')
  )) {
    return NextResponse.redirect(new URL('/auth/join', request.url))
  }

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (session && (path === '/auth/join' || path === '/auth/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
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