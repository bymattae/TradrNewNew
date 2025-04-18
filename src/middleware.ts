import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that don't require authentication
const publicRoutes = ['/auth/join', '/auth/magic-link-sent', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = new URL(request.url).pathname;

  // Always allow callback route
  if (pathname.startsWith('/auth/callback')) {
    return res;
  }

  // If no session and trying to access protected route, redirect to join
  if (!session && !publicRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.redirect(new URL('/auth/join', request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // If has session and trying to access auth pages (except callback), redirect to dashboard
  if (session && (pathname === '/auth/join' || pathname === '/auth/magic-link-sent')) {
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