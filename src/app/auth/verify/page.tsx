'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function VerifyPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          router.push('/auth/join');
          return;
        }
        
        if (!session) {
          console.error('No session found');
          router.push('/auth/join');
          return;
        }

        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push('/onboarding');
        }, 2000);
        
      } catch (error) {
        console.error('Error:', error);
        router.push('/auth/join');
      }
    };

    handleAuth();
  }, [router, supabase]);

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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Your account is verified
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Redirecting you to create your profile...
          </p>
        </div>
      </div>
    </div>
  );
} 