import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();

    // If there's no session and we're on a protected route, redirect to login
    if (!session && error?.status === 401) {
      return NextResponse.redirect(new URL('/auth/join', request.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    return NextResponse.redirect(new URL('/auth/join', request.url));
  }
}

// Only run middleware on auth-required routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/strategy/:path*',
    '/onboarding/:path*'
  ],
}; 