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
    <div className="h-screen w-full max-w-md mx-auto flex flex-col bg-black overflow-hidden">
      {/* Top Navbar */}
      <div className="w-full bg-black border-b border-[#111] px-6 py-2.5 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-xl font-bold text-white text-center font-inter">My Tradr</h1>
        <button 
          onClick={() => router.push('/settings')} 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-6 py-3 space-y-3">
        {/* Link Card with Hover Effect */}
        <div 
          className="w-full bg-gradient-to-r from-[#111] to-[#0A0A0A] rounded-2xl p-3 transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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
        <div className="w-full bg-gradient-to-b from-[#111] to-[#0A0A0A] rounded-2xl p-3 space-y-3">
          {/* Avatar and Username Section */}
          <div className="bg-[#0A0A0A] rounded-xl p-3">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-black">
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
          <div className="bg-[#0A0A0A] rounded-xl p-3">
            <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
              {profile?.bio || 'I\'m a trader from germany'}
            </p>
          </div>

          {/* Tags Section */}
          <div className="bg-[#0A0A0A] rounded-xl p-3">
            <div className="flex flex-wrap gap-1.5">
              {(profile?.tags || ['#Coolman']).map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-[#222] text-[#7C3AED] text-xs rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Section with Icons */}
          <div className="bg-[#0A0A0A] rounded-xl p-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <p className="text-white font-semibold text-sm">12.5%</p>
                <p className="text-gray-400 text-xs">Gain</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <BarChart2 className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <p className="text-white font-semibold text-sm">89%</p>
                <p className="text-gray-400 text-xs">Win Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <p className="text-white font-semibold text-sm">1:3</p>
                <p className="text-gray-400 text-xs">Risk Ratio</p>
              </div>
            </div>
          </div>

          {/* CTA Section with Community Focus */}
          <div className="bg-[#0A0A0A] rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="text-white font-semibold text-sm">Join our alpha community!</h3>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">Connect with 500+ traders, share insights, and grow together. Your journey to success starts here.</p>
            <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white py-2.5 rounded-xl font-medium hover:from-[#6D28D9] hover:to-[#5B21B6] transition-all duration-300 shadow-lg shadow-[#7C3AED]/20">
              Join Community
            </button>
          </div>

          {/* Powered by Tradr */}
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-500 text-xs">Powered by</span>
            <span className="text-gray-400 text-xs font-medium">Tradr</span>
          </div>
        </div>
      </div>

      {/* Floating Hub Button */}
      <div className="p-3">
        <button 
          className="w-12 h-12 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-full flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 hover:from-[#6D28D9] hover:to-[#5B21B6] transition-all duration-300"
          onClick={() => router.push('/hub')}
        >
          <Grid className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
} 