import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('Middleware - Path:', req.nextUrl.pathname)
  
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('Middleware - Session present:', !!session)

  const pathname = req.nextUrl.pathname

  // Define public routes that don't require auth
  const publicRoutes = ['/auth/join', '/auth/callback', '/auth/magic-link-sent']
  const isPublicRoute = publicRoutes.includes(pathname)

  console.log('Middleware - Is public route:', isPublicRoute)

  // If it's a public route, allow access
  if (isPublicRoute) {
    console.log('Middleware - Allowing access to public route')
    return res
  }

  // If there's no session and trying to access protected routes
  if (!session) {
    console.log('Middleware - No session, redirecting to /auth/join')
    return NextResponse.redirect(new URL('/auth/join', req.url))
  }

  // If there's a session and trying to access auth pages (except callback)
  if (session && pathname.startsWith('/auth') && pathname !== '/auth/callback') {
    console.log('Middleware - Session exists, redirecting from auth page to /onboarding')
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  console.log('Middleware - Proceeding with request')
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
} 