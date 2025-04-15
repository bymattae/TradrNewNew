'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const returnTo = searchParams.get('returnTo');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ 
    text: error || '', 
    type: error ? 'error' : '' 
  });
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const redirectTo = `${window.location.origin}/auth/callback${returnTo ? `?returnTo=${returnTo}` : ''}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
          data: {
            email
          }
        }
      });

      if (error) throw error;

      setMessage({
        text: 'Check your email for the magic link! The link will expire in 24 hours.',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({
        text: error.message || 'Failed to send verification link. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4">
        <button 
          onClick={() => router.back()}
          className="text-white hover:text-gray-300"
        >
          ←
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Join Tradr</h1>
            <p className="text-gray-400">
              Enter your email to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {message.text && (
              <p className={`text-center text-sm ${
                message.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Sending...' : 'Continue with email'}</span>
              <span>→</span>
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
} 