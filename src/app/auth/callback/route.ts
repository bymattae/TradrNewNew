import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Exchange error:', error);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/join?error=${encodeURIComponent(error.message)}`
        );
      }

      // Successfully exchanged code for session
      return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
    } catch (error: any) {
      console.error('Callback error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/join?error=${encodeURIComponent('Something unexpected happened')}`
      );
    }
  }

  // No code provided
  return NextResponse.redirect(
    `${requestUrl.origin}/auth/join?error=${encodeURIComponent('No code provided')}`
  );
} 