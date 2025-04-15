'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, components, layout } from '@/app/lib/styles/designSystem';
import { createStrategy } from '@/app/lib/actions/strategy';
import { toast } from 'sonner';
import { useAuth } from '@/app/lib/contexts/AuthContext';
import { UserProfile } from '@/app/components/UserProfile';
import Link from 'next/link';

export default function StrategyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [strategyData, setStrategyData] = useState({
    name: '',
    bio: '',
    tags: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth/join');
      return;
    }

    setLoading(true);
    try {
      await createStrategy({
        title: strategyData.name.trim(),
        description: strategyData.bio.trim(),
        hashtags: strategyData.tags
      });
      
      toast.success('Strategy created successfully');
      // Reset form
      setStrategyData({
        name: '',
        bio: '',
        tags: []
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create strategy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={layout.container}>
      {/* Header */}
      <div className={components.nav.header}>
        <button 
          onClick={() => router.back()}
          className={components.button.icon}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">What&apos;s this strategy about?</h1>
          <p className="text-sm text-muted-foreground mt-1">1/3 steps</p>
        </div>
        <div className="w-5"></div>
      </div>

      {/* User Profile or Sign In Button */}
      <div className="absolute top-4 right-4">
        {user ? (
          <UserProfile />
        ) : (
          <Link 
            href="/auth/join"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign in
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 space-y-8 overflow-y-auto scrollbar-hide max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Create Strategy</h1>
        
        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Strategy Name
            </label>
            <input
              id="name"
              type="text"
              value={strategyData.name}
              onChange={(e) => setStrategyData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="bio"
              value={strategyData.bio}
              onChange={(e) => setStrategyData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              value={strategyData.tags.join(', ')}
              onChange={(e) => setStrategyData(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. forex, scalping, momentum"
            />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className={components.nav.footer}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{user ? 'Next step' : 'Sign in to continue'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
} 