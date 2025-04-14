'use client';

import { useAuth } from '../lib/contexts/AuthContext';
import { toast } from 'sonner';

export function UserProfile() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        Signed in as: {user.email}
      </div>
      <button
        onClick={handleSignOut}
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Sign Out
      </button>
    </div>
  );
} 