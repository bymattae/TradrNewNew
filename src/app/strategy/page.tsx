'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStrategy } from '@/app/lib/actions/strategy';
import { nanoid } from 'nanoid';
import getSupabaseBrowserClient from '@/lib/supabase/client';

export default function StrategyPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const strategyData = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
    };

    if (!strategyData.name || !strategyData.bio || !strategyData.tags.length) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const strategy_id = nanoid();
      await createStrategy({
        strategy_id,
        user_id: user.id,
        title: strategyData.name.trim(),
        description: strategyData.bio.trim(),
        hashtags: strategyData.tags,
        created_at: new Date().toISOString()
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating strategy:', error);
      alert('Failed to create strategy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Create Your Strategy</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Strategy Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter strategy name"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Describe your strategy"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="forex, scalping, momentum"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Strategy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 