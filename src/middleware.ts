import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/auth/join', '/auth/magic-link-sent', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = new URL(request.url).pathname;

  // Allow access to public routes regardless of session
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return res;
  }

  // If no session, redirect to join page (except for public routes)
  if (!session) {
    const response = NextResponse.redirect(new URL('/auth/join', request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // If we have a session and they're trying to access join page, redirect to dashboard
  if (session && pathname === '/auth/join') {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // For all other cases, allow access
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 