import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/auth/join', '/auth/magic-link-sent', '/auth/callback'];

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    const { data: { session }, error } = await supabase.auth.getSession();

    // If there was an error getting the session, sign out and redirect to join
    if (error) {
      console.error('Session error:', error);
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/join', request.url));
    }

    const pathname = new URL(request.url).pathname;
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If on a public route and have a session, redirect to onboarding
    if (isPublicRoute && session) {
      const response = NextResponse.redirect(new URL('/onboarding', request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    // If not on a public route and no session, redirect to join
    if (!isPublicRoute && !session) {
      const response = NextResponse.redirect(new URL('/auth/join', request.url));
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    // For all other cases, proceed but with strict cache headers
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/join', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 