import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full px-6 py-8 bg-gray-800 rounded-xl shadow-lg text-center">
        <h1 className="text-5xl font-bold text-purple-400 mb-4">404 🤔</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">
          Oops! Looks like you&apos;ve wandered into uncharted territory!
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Back to Home Base 🏠
        </Link>
      </div>
    </div>
  );
} 