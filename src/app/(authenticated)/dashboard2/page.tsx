'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Settings, Share2, Link as LinkIcon, Grid, Pencil } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard2Page() {
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
    <div className="min-h-screen w-full max-w-md mx-auto flex flex-col bg-black">
      {/* Top Navbar */}
      <div className="w-full bg-black px-6 py-5 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-2xl font-bold text-white text-center font-inter">My Tradr</h1>
        <button 
          onClick={() => router.push('/settings')} 
          className="p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col px-4 space-y-4">
        {/* Link Card */}
        <div className="w-full bg-[#111] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm">Your Tradr is live:</span>
              <span className="text-white/80 text-sm">tradr.co/{profile?.username || 'cryptowhale'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
                <Image src="/whatsapp.svg" width={20} height={20} alt="WhatsApp" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
                <Image src="/twitter.svg" width={20} height={20} alt="Twitter" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
                <Image src="/telegram.svg" width={20} height={20} alt="Telegram" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="w-full bg-[#111] rounded-2xl p-6">
          {/* Profile Header */}
          <div className="relative">
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => router.push('/settings/profile')}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              >
                <Pencil className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Avatar and Status */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-black">
                  <Image
                    src={profile?.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-black" />
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-white text-2xl font-semibold">@{profile?.username || 'cryptowhale'}</h2>
                <p className="text-gray-400 mt-2 text-sm">NFT Collector | DeFi Explorer | Web3 Native 🌊</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-4 py-1.5 bg-[#2D1B69] text-[#7C3AED] text-sm rounded-full font-medium">
                #NFTTrader
              </span>
              <span className="px-4 py-1.5 bg-[#2D1B69] text-[#7C3AED] text-sm rounded-full font-medium">
                #DeFiWhale
              </span>
              <span className="px-4 py-1.5 bg-[#0D3229] text-[#10B981] text-sm rounded-full font-medium">
                #Web3
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 bg-black/20 rounded-xl p-4">
              <div className="text-center">
                <p className="text-[#10B981] font-semibold text-lg">+12.5%</p>
                <p className="text-gray-400 text-xs">Gain</p>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">89%</p>
                <p className="text-gray-400 text-xs">Win Rate</p>
              </div>
              <div className="text-center">
                <p className="text-[#7C3AED] font-semibold text-lg">1:3</p>
                <p className="text-gray-400 text-xs">Avg RR</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-6 space-y-3">
              <h3 className="text-white font-semibold text-lg">Join my free telegram channel!</h3>
              <p className="text-gray-400 text-sm">Get involved with other alphas and start scaling. This is your time right now.</p>
              <button className="w-full bg-[#7C3AED] text-white py-3 rounded-xl font-medium hover:bg-[#6D28D9] transition-colors">
                Check it out
              </button>
            </div>

            {/* Powered by Tradr */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Image src="/tradr-icon.svg" width={16} height={16} alt="Tradr" />
              <span className="text-gray-400 text-sm">Powered by Tradr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Hub Button */}
      <button 
        className="fixed bottom-6 left-6 w-14 h-14 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg shadow-[#7C3AED]/20 hover:bg-[#6D28D9] transition-colors"
        onClick={() => router.push('/hub')}
      >
        <Grid className="w-6 h-6 text-white" />
      </button>
    </div>
  );
} 