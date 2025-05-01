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
      {/* Top Bar */}
      <div className="w-full bg-white/5 backdrop-blur-lg border-b border-white/5 px-5 py-3 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-lg font-bold text-white text-center font-inter">My Tradr</h1>
        <button 
          onClick={() => router.push('/settings')} 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-4 flex flex-col">
        {/* "Try Pro" Button */}
        <div className="flex justify-end mb-3">
          <button className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-all">
            Try Pro for free
          </button>
        </div>

        {/* Profile Preview Container */}
        <div className="h-[75vh] flex flex-col rounded-2xl overflow-hidden bg-[#1a1825]">
          {/* URL Bar */}
          <div className="w-full bg-black/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">tradr.io/{profile?.username || 'username'}</span>
            </div>
            <button className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4 text-purple-400" />
            </button>
          </div>

          {/* Profile Content - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="px-6 py-8 space-y-6">
              {/* Avatar and Username Section */}
              <div className="text-center space-y-3">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-purple-500/30 ring-offset-4 ring-offset-[#1a1825]">
                  <Image
                    src={profile?.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl font-inter">
                    {profile?.username || currentUser?.email?.split('@')[0] || 'cryptowhale'}
                  </h2>
                  <p className="text-gray-400 text-sm">@{profile?.username || 'username'}</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="text-center max-w-sm mx-auto">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {profile?.bio || 'I\'m a trader from germany'}
                </p>
              </div>

              {/* Tags Section */}
              <div className="flex flex-wrap justify-center gap-2">
                {(profile?.tags || ['#Coolman']).map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats Section */}
              <div className="bg-black/20 rounded-xl p-4 max-w-sm mx-auto w-full">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-white font-semibold text-lg">12.5%</p>
                    <p className="text-gray-400 text-sm">Gain</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-white font-semibold text-lg">89%</p>
                    <p className="text-gray-400 text-sm">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-white font-semibold text-lg">1:3</p>
                    <p className="text-gray-400 text-sm">Risk Ratio</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-5 max-w-sm mx-auto w-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <Users className="w-6 h-6 text-purple-400" />
                    <h3 className="text-white font-bold text-lg">Join our alpha community</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed text-center">
                    Connect with 500+ traders, share insights, and grow together.
                  </p>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/20">
                    Join Community
                  </button>
                </div>
              </div>

              {/* Powered by Tradr */}
              <div className="flex items-center justify-center space-x-1 pb-4">
                <span className="text-gray-500 text-sm">Powered by</span>
                <span className="text-gray-400 text-sm font-medium">Tradr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hub Button */}
      <div className="p-4">
        <button 
          className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          onClick={() => router.push('/hub')}
        >
          <Grid className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
} 