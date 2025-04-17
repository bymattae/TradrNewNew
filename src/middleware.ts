import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no session and trying to access protected routes
  if (!session) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/auth/join', req.url));
    }
  }

  // If there's a session and trying to access auth pages
  if (session) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}; 