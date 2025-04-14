'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { colors, components, layout } from '@/app/lib/styles/designSystem';
import { createStrategy } from '@/app/lib/actions/strategy';
import { toast } from 'sonner';
import { useAuth } from '@/app/lib/contexts/AuthContext';
import { UserProfile } from '@/app/components/UserProfile';
import { AuthForm } from '@/app/components/AuthForm';

export default function StrategyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [strategyData, setStrategyData] = useState({
    name: '',
    bio: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && strategyData.tags.length < 2) {
      const tagToAdd = newTag.startsWith('#') ? newTag : `#${newTag}`;
      setStrategyData(prev => ({
        ...prev,
        tags: [...prev.tags, tagToAdd]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setStrategyData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!strategyData.name.trim()) {
      toast.error('Please enter a strategy name');
      return;
    }

    if (!strategyData.bio.trim()) {
      toast.error('Please enter a strategy description');
      return;
    }

    setLoading(true);
    try {
      const result = await createStrategy({
        title: strategyData.name.trim(),
        description: strategyData.bio.trim(),
        hashtags: strategyData.tags
      });

      if (result.success && result.strategy_id) {
        toast.success('Strategy created successfully');
        router.push(`/strategy/${result.strategy_id}/connect`);
      } else {
        throw new Error(result.error || 'Failed to create strategy');
      }
    } catch (error: any) {
      console.error('Error creating strategy:', error);
      toast.error(error.message || 'Failed to create strategy');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm />
      </div>
    );
  }

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

      {/* User Profile */}
      <div className="absolute top-4 right-4">
        <UserProfile />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 space-y-8 overflow-y-auto scrollbar-hide max-w-2xl mx-auto w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy name</label>
          <input
            type="text"
            value={strategyData.name}
            onChange={(e) => setStrategyData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. London Breakout"
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy bio</label>
          <textarea
            value={strategyData.bio}
            onChange={(e) => setStrategyData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Keep it sharp and simple."
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl min-h-[120px] resize-none"
            maxLength={120}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Tags</label>
            <span className="text-xs text-gray-500">{strategyData.tags.length}/2</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {strategyData.tags.map((tag, index) => (
              <div
                key={index}
                className="group relative bg-indigo-600/20 border border-indigo-500/30 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-xl"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="absolute -top-1.5 -right-1.5 hidden group-hover:flex bg-red-500 rounded-full w-4 h-4 items-center justify-center text-xs shadow-lg"
                >
                  ×
                </button>
              </div>
            ))}
            {strategyData.tags.length < 2 && (
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="+ Add tag"
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500/50 w-24 backdrop-blur-xl placeholder:text-gray-500"
              />
            )}
          </div>
        </div>
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
              <span>Next step</span>
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