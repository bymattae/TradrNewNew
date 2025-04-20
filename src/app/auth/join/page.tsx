'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const errorMessages = {
  missing_code: 'Authentication link is invalid or expired.',
  auth_error: 'There was a problem with authentication. Please try again.',
  session_error: 'Unable to create your session. Please try again.',
  profile_error: 'Error accessing your profile. Please try again.',
  unexpected: 'An unexpected error occurred. Please try again.',
}

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();
  const errorType = searchParams.get('error');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, bio, avatar_url, tags')
            .eq('id', session.user.id)
            .single();

          // Check if profile exists and has any data
          const isProfileEmpty = !profile || (
            !profile.username &&
            !profile.bio &&
            !profile.avatar_url &&
            (!profile.tags || profile.tags.length === 0)
          );

          // Only redirect to onboarding if profile is completely empty
          if (isProfileEmpty) {
            router.replace('/onboarding');
          } else {
            router.replace('/dashboard');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    // Check for error in URL params
    if (errorType && errorMessages[errorType as keyof typeof errorMessages]) {
      setError(errorMessages[errorType as keyof typeof errorMessages]);
    }
  }, [router, supabase, searchParams]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        setError(error.message);
        return;
      }

      setEmailSent(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0C]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0C] px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Image
              src="https://wphqgmcoqneazpbviprp.supabase.co/storage/v1/object/public/assets/TradrIcon%20(1).png"
              alt="Tradr Logo"
              width={48}
              height={48}
              priority
              className="w-12 h-12 object-contain"
              onError={() => setImageError(true)}
              style={{ opacity: imageError ? 0.5 : 1 }}
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-center text-2xl font-semibold text-white">
              <span className="text-gray-400">Where </span>
              <span className="font-semibold text-white">real traders</span>
              <span className="text-gray-400"> get noticed.</span>
            </h2>
            <p className="text-center text-sm text-gray-400">
              New or returning? Just enter your email
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-900/50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleEmailSignUp}
            disabled={loading}
            className={`relative flex w-full items-center justify-center rounded-2xl bg-violet-600 px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending magic link...
              </span>
            ) : (
              'Continue with email'
            )}
          </button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#0A0A0C] px-3 text-gray-500 text-xs">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-black hover:bg-zinc-900 transition-colors">
            <Image src="/twitter.svg" alt="Continue with X" width={20} height={20} className="w-5 h-5" />
          </button>
          <button className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-black hover:bg-zinc-900 transition-colors">
            <Image src="/apple.svg" alt="Continue with Apple" width={16} height={16} className="w-[18px]" />
          </button>
          <button className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-black hover:bg-zinc-900 transition-colors">
            <Image src="/google.svg" alt="Continue with Google" width={18} height={18} className="w-5" />
          </button>
        </div>

        <p className="text-center text-[11px] text-gray-500">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-violet-400 hover:text-violet-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-violet-400 hover:text-violet-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
} 