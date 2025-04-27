'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Settings, Share2, Link, Grid } from 'lucide-react';
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
      <div className="w-full bg-black border-b border-[#111] px-6 py-5 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-2xl font-bold text-white text-center font-inter">My Tradr</h1>
        <button 
          onClick={() => router.push('/settings')} 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-6 py-6 space-y-6">
        {/* Link Card */}
        <div className="w-full bg-[#111] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link className="w-5 h-5 text-[#7C3AED]" />
              <span className="text-white text-sm font-medium">tradr.io/{profile?.username || 'username'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full bg-[#111] border border-[#222] hover:bg-[#222] transition-colors">
                <Share2 className="w-5 h-5 text-[#7C3AED]" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="w-full bg-[#111] rounded-2xl p-6 space-y-6">
          {/* Avatar and Username */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-black">
              <Image
                src={profile?.avatar_url || '/default-avatar.png'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg font-inter">
                {profile?.username || currentUser?.email?.split('@')[0] || 'cryptowhale'}
              </h2>
              <p className="text-gray-400 text-sm">@{profile?.username || 'username'}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {profile?.bio || 'I\'m a trader from germany'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(profile?.tags || ['#Coolman']).map((tag: string, index: number) => (
              <span 
                key={index} 
                className="px-3 py-1.5 bg-[#222] text-[#7C3AED] text-sm rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <p className="text-white font-semibold text-lg">12.5%</p>
              <p className="text-gray-400 text-xs">Gain</p>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">89%</p>
              <p className="text-gray-400 text-xs">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">1:3</p>
              <p className="text-gray-400 text-xs">Risk Ratio</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-lg">Join my free telegram channel!</h3>
            <p className="text-gray-400 text-sm">Get involved with other alphas and start scaling. This is your time right now.</p>
            <button className="w-full bg-[#7C3AED] text-white py-3 rounded-xl font-medium hover:bg-[#6D28D9] transition-colors shadow-lg shadow-[#7C3AED]/20">
              Check it out
            </button>
          </div>

          {/* Powered by Tradr */}
          <div className="flex items-center justify-center space-x-1 pt-2">
            <span className="text-gray-500 text-xs">Powered by</span>
            <span className="text-gray-400 text-xs font-medium">Tradr</span>
          </div>
        </div>
      </div>

      {/* Floating Hub Button */}
      <button 
        className="absolute bottom-6 left-6 w-14 h-14 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 hover:bg-[#6D28D9] transition-colors"
        onClick={() => router.push('/hub')}
      >
        <Grid className="w-6 h-6 text-white" />
      </button>
    </div>
  );
} 