import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Define public routes that don't require auth
  const publicRoutes = ['/auth/join', '/auth/callback', '/auth/magic-link-sent', '/onboarding'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return res;
  }

  // If there's no session and trying to access protected routes
  if (!session) {
    return NextResponse.redirect(new URL('/auth/join', req.url));
  }

  // If there's a session and trying to access auth pages (except callback)
  if (session && pathname.startsWith('/auth') && pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}; 