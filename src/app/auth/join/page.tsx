'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();

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
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'invalid_code':
          toast.error('Invalid magic link. Please try again.');
          break;
        case 'no_user':
          toast.error('User not found. Please try again.');
          break;
        case 'server_error':
          toast.error('Server error. Please try again.');
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }
    }
  }, [router, supabase, searchParams]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        toast.error(error.message);
      } else {
        router.push('/auth/magic-link-sent');
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Join Tradr
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email to get started with your trading journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {message && (
            <div className="rounded-xl bg-red-900/50 border border-red-500/50 p-4">
              <div className="text-sm text-red-200">{message}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
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
                'Continue with Email'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 