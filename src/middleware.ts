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

  // Public routes that don't require auth
  const publicRoutes = ['/strategy', '/auth/verify', '/auth/callback']
  if (publicRoutes.some(route => request.nextUrl.pathname === route)) {
    return response
  }

  // Auth routes - redirect to dashboard if already logged in
  const authRoutes = ['/auth/join', '/auth/login']
  if (session && authRoutes.some(route => request.nextUrl.pathname === route)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protected routes - require auth
  if (!session && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/strategy/') || // Only protect nested strategy routes
    request.nextUrl.pathname.startsWith('/onboarding')
  )) {
    return NextResponse.redirect(new URL('/auth/join', request.url))
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