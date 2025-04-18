'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function JoinPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error('Error sending magic link:', error);
        throw error;
      }

      console.log('Magic link sent successfully');
      router.push('/auth/magic-link-sent');
    } catch (error: any) {
      console.error('Error in handleEmailSignUp:', error);
      setMessage(error.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-center text-4xl font-bold tracking-tight text-white">
            Join Tradr
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Start building your Tradr now.
          </p>
        </div>
        
        {message && (
          <div className="rounded-md bg-red-900/50 p-4 text-red-200">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailSignUp}>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Make your page →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 