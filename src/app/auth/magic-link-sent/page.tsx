'use client';

import { useRouter } from 'next/navigation';

export default function MagicLinkSentPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-purple-600/20">
            <svg
              className="h-12 w-12 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            We&apos;ve sent you a magic link to sign in. Click the link in your email to continue.
          </p>
        </div>
      </div>
    </div>
  );
} 