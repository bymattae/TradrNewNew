import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();
  
  const pathname = new URL(request.url).pathname;

  // Protect authenticated routes
  if ((pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname.startsWith('/onboarding') || pathname === '/profile') && !pathname.startsWith('/dashboard2')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/join', request.url));
    }

    // Redirect from old profile path to authenticated route
    if (pathname === '/profile') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && (pathname.startsWith('/auth/join') || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
} 