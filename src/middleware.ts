import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that need special handling
const authRoutes = ['/auth/join', '/auth/magic-link-sent', '/auth/callback'];
const setupRoutes = ['/onboarding'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = new URL(request.url).pathname;

  // Always allow callback route
  if (pathname.startsWith('/auth/callback')) {
    return res;
  }

  // If no session, only allow auth routes
  if (!session) {
    if (authRoutes.some(route => pathname.startsWith(route))) {
      return res;
    }
    const response = NextResponse.redirect(new URL('/auth/join', request.url));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // If we have a session...
  if (session) {
    // Don't allow auth pages if logged in (except callback)
    if (pathname === '/auth/join' || pathname === '/auth/magic-link-sent') {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    // Check if user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    // If no profile and not on onboarding, redirect to onboarding
    if (!profile && !pathname.startsWith('/onboarding')) {
      const response = NextResponse.redirect(new URL('/onboarding', request.url));
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }

    // If has profile and on onboarding, redirect to dashboard
    if (profile && pathname.startsWith('/onboarding')) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    }
  }

  // For all other cases, allow access
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 