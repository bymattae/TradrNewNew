'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full px-6 py-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Yikes! 😅</h2>
        <p className="text-gray-300 mb-6">
          Something went wrong but no worries - we got your back!
        </p>
        <button
          onClick={reset}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Let&apos;s try that again 🚀
        </button>
      </div>
    </div>
  );
} 