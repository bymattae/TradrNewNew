import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth/join', '/auth/magic-link-sent', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If on a public route and has session, redirect to onboarding
  if (isPublicRoute && session) {
    const response = NextResponse.redirect(new URL('/onboarding', req.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // If not on a public route and no session, redirect to join
  if (!isPublicRoute && !session) {
    const response = NextResponse.redirect(new URL('/auth/join', req.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // For all other cases, proceed normally
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}; 