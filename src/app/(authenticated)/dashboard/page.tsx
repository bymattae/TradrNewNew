'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Settings, Share2, Link, Home } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/join');
          return;
        }

        setCurrentUser(user);

        const { data: profile } = await supabase
          .from('profiles')
          .select('username, bio, avatar_url, tags')
          .eq('id', user.id)
          .single();

        const isProfileEmpty = !profile || (
          !profile.username &&
          !profile.bio &&
          !profile.avatar_url &&
          (!profile.tags || profile.tags.length === 0)
        );

        if (isProfileEmpty) {
          toast.error('Please complete your profile first');
          router.push('/onboarding');
          return;
        }

        setProfile(profile);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/join');
      }
    };
    
    checkAuth();
  }, [router, supabase]);

  return (
    <div className="h-[844px] w-full max-w-md mx-auto flex flex-col bg-black overflow-hidden">
      {/* Top Navbar */}
      <div className="w-full bg-black border-b border-[#111] px-4 py-4 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-2xl font-bold text-white text-center">My Tradr</h1>
        <button 
          onClick={() => router.push('/settings')} 
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-4 py-6 space-y-6">
        {/* Your Tradr is Live Box */}
        <div className="w-full bg-[#111] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link className="w-5 h-5 text-white" />
              <span className="text-white text-sm">Your Tradr is Live</span>
            </div>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Preview Card */}
        <div className="w-full bg-[#111] rounded-xl p-4 space-y-4">
          {/* Avatar and Username */}
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={profile?.avatar_url || '/default-avatar.png'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold">
                {profile?.username || currentUser?.email?.split('@')[0] || 'cryptowhale'}
              </h2>
              <p className="text-gray-400 text-sm">@tradr</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-white text-sm">
            {profile?.bio || 'I\'m a trader from germany'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(profile?.tags || ['#Coolman']).map((tag: string, index: number) => (
              <span key={index} className="text-blue-400 text-sm">#{tag}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <p className="text-white font-semibold">12.5%</p>
              <p className="text-gray-400 text-xs">Gain</p>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">89%</p>
              <p className="text-gray-400 text-xs">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">1:3</p>
              <p className="text-gray-400 text-xs">Risk Ratio</p>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Join my free telegram channel!
          </button>

          {/* Powered by Tradr */}
          <div className="flex items-center justify-center space-x-1 pt-2">
            <span className="text-gray-400 text-xs">Powered by</span>
            <span className="text-white text-xs font-medium">Tradr</span>
          </div>
        </div>
      </div>

      {/* Floating Hub Button */}
      <button 
        className="absolute bottom-6 left-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => router.push('/hub')}
      >
        <Home className="w-6 h-6 text-white" />
      </button>
    </div>
  );
} 