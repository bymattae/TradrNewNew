'use client';

import { useRouter } from 'next/navigation';

export default function MagicLinkSent() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0C] px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-violet-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5L10 3M10 3L12 5M10 3L8 1M10 3L12 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M19 14L21 12M21 12L23 14M21 12L19 10M21 12L23 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3 14L4 13M4 13L5 14M4 13L3 12M4 13L5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M17.5 6.5L4.5 19.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className="animate-pulse"
                d="M17.5 6.5L19 5L19.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="text-center text-2xl font-semibold text-white">
              Check your e-mail
            </h2>
            <p className="text-center text-sm text-gray-400">
              We&apos;ve sent you a magic link!
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start space-x-3">
            <svg className="h-5 w-5 text-violet-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-400">
              Make sure to check your spam folder if you don&apos;t see the email.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/auth/join')}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          Return to sign in
        </button>
      </div>
    </div>
  );
} 