'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Settings, Share2, Link, Grid, TrendingUp, Users, BarChart2, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard3Page() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

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
    <div className="h-screen w-full max-w-md mx-auto flex flex-col bg-gradient-to-b from-[#13111C] to-[#17132B] overflow-hidden">
      {/* Top Navbar */}
      <div className="w-full bg-white/5 backdrop-blur-lg border-b border-white/5 px-5 py-2 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-lg font-bold text-white text-center font-inter">My Tradr</h1>
        <button 
          onClick={() => router.push('/settings')} 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-5 py-2.5 space-y-2.5 min-h-0">
        {/* Link Card with Hover Effect */}
        <div 
          className="w-full bg-white/5 backdrop-blur-lg rounded-xl p-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">tradr.io/{profile?.username || 'username'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Share2 className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex-1 w-full bg-white/5 backdrop-blur-lg rounded-xl p-2.5 min-h-0">
          {/* Scrollable Container */}
          <div className="h-full overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {/* Avatar and Username Section */}
            <div className="bg-black/20 rounded-lg p-2.5">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500/30 ring-offset-2 ring-offset-[#13111C]">
                  <Image
                    src={profile?.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm font-inter">
                    {profile?.username || currentUser?.email?.split('@')[0] || 'cryptowhale'}
                  </h2>
                  <p className="text-gray-400 text-xs">@{profile?.username || 'username'}</p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-black/20 rounded-lg p-2.5">
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                {profile?.bio || 'I\'m a trader from germany'}
              </p>
            </div>

            {/* Tags Section */}
            <div className="bg-black/20 rounded-lg p-2.5">
              <div className="flex flex-wrap gap-1.5">
                {(profile?.tags || ['#Coolman']).map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Section with Icons */}
            <div className="bg-black/20 rounded-lg p-2.5">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1.5">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-white font-semibold text-sm">12.5%</p>
                  <p className="text-gray-400 text-xs">Gain</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1.5">
                    <BarChart2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-white font-semibold text-sm">89%</p>
                  <p className="text-gray-400 text-xs">Win Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-white font-semibold text-sm">1:3</p>
                  <p className="text-gray-400 text-xs">Risk Ratio</p>
                </div>
              </div>
            </div>

            {/* CTA Section with Community Focus */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-3 space-y-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-bold text-base">Join our alpha community</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pl-7.5">Connect with 500+ traders, share insights, and grow together.</p>
              </div>
              <div className="flex items-center justify-end space-x-2 pl-7.5">
                <span className="text-purple-400 text-sm font-medium">Join now</span>
                <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center group hover:bg-purple-500/30 transition-all duration-300">
                  <svg 
                    className="w-4 h-4 text-purple-400 transform group-hover:translate-x-0.5 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Powered by Tradr */}
            <div className="flex items-center justify-center space-x-1 py-1">
              <span className="text-gray-500 text-sm">Powered by</span>
              <span className="text-gray-400 text-sm font-medium">Tradr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hub Button */}
      <div className="p-2.5">
        <button 
          className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          onClick={() => router.push('/hub')}
        >
          <Grid className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
} 