import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware - Path:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Middleware - Session present:', !!session);

  const pathname = req.nextUrl.pathname;

  // Define public routes that don't require auth
  const publicRoutes = ['/auth/join', '/auth/callback', '/auth/magic-link-sent', '/auth/verify'];
  const isPublicRoute = publicRoutes.includes(pathname);

  console.log('Middleware - Is public route:', isPublicRoute);

  // If it's a public route, allow access
  if (isPublicRoute) {
    console.log('Middleware - Allowing access to public route');
    return res;
  }

  // If there's no session and trying to access protected routes
  if (!session) {
    console.log('Middleware - No session, redirecting to /auth/join');
    return NextResponse.redirect(new URL('/auth/join', req.url));
  }

  // If there's a session but no profile, redirect to onboarding
  if (session && pathname !== '/onboarding') {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (!profile) {
      console.log('Middleware - No profile found, redirecting to /onboarding');
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  // If there's a session and trying to access auth pages (except callback)
  if (session && pathname.startsWith('/auth') && pathname !== '/auth/callback') {
    console.log('Middleware - Session exists, redirecting from auth page to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  console.log('Middleware - Proceeding with request');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}; 