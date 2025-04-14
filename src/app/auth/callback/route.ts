import { createClient } from '@/app/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    // Handle authentication errors
    if (error) {
      console.error('Auth error:', { error, error_description });
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/join?error=${encodeURIComponent(error_description || 'Something went wrong')}`
      );
    }

    if (!code) {
      console.error('No code provided');
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/join?error=${encodeURIComponent('No code provided')}`
      );
    }

    const supabase = createClient();

    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Exchange error:', exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/join?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    // Successful authentication - redirect to onboarding
    return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
  } catch (error: any) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/join?error=${encodeURIComponent('Something unexpected happened')}`
    );
  }
} 