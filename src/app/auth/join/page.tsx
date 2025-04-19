'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import Image from 'next/image';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [imageError, setImageError] = useState(false);
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
            <h2 className="text-center text-2xl tracking-tight">
              <span className="text-gray-400">Make your </span>
              <span className="font-semibold text-white">first trade</span>
              <span className="text-gray-400"> today.</span>
            </h2>
            <p className="text-center text-sm text-gray-400">
              Register or sign in to get started
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

          {message && (
            <div className="rounded-2xl bg-red-900/50 border border-red-500/50 p-4">
              <div className="text-sm text-red-200">{message}</div>
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
          <button className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <Image src="/apple.svg" alt="Apple" width={18} height={18} className="opacity-60" />
          </button>
          <button className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <Image src="/google.svg" alt="Google" width={18} height={18} className="opacity-60" />
          </button>
          <button className="flex h-11 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <Image src="/twitter.svg" alt="Twitter" width={18} height={18} className="opacity-60" />
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