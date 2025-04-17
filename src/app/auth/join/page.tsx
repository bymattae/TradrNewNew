'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function JoinPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ 
    text: '', 
    type: '' 
  });
  const supabase = createClientComponentClient();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Get the base URL for redirects
      const redirectBase = process.env.NODE_ENV === 'production' 
        ? 'https://tradr-v1.vercel.app'
        : window.location.origin;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectBase}/auth/callback`,
        },
      });

      if (error) throw error;

      // Redirect to magic link sent page
      router.push('/auth/magic-link-sent');
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({
        text: error.message || 'Failed to send magic link. Please try again.',
        type: 'error'
      });
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
        
        {message.text && (
          <div className={`rounded-md p-4 ${
            message.type === 'error' ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'
          }`}>
            {message.text}
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