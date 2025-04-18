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
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Allow access to public routes regardless of session
  if (isPublicRoute) {
    return res;
  }

  // If not a public route and no session, redirect to join
  if (!session) {
    return NextResponse.redirect(new URL('/auth/join', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 