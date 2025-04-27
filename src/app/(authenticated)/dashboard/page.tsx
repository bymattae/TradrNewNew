'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import ProfilePreview from '@/app/components/ProfilePreview';
import CopyableUrl from '@/app/components/CopyableUrl';
import { User } from '@supabase/supabase-js';
import { Settings } from 'lucide-react';

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

        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, bio, avatar_url, tags')
          .eq('id', user.id)
          .single();

        // Check if profile exists and has any data
        const isProfileEmpty = !profile || (
          !profile.username &&
          !profile.bio &&
          !profile.avatar_url &&
          (!profile.tags || profile.tags.length === 0)
        );

        // Only redirect to onboarding if profile is completely empty
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

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [router, supabase]);

  const mockStrategies = [
    {
      title: "Volume-based breakout strategy",
      stats: {
        gain: 12.5,
        winRate: 89,
        riskRatio: "1:3"
      }
    }
  ];

  const mockLinks = [
    {
      title: "Join my free telegram channel!",
      description: "Get involved with other alphas and start scaling. This is your time right now.",
      cta: {
        text: "Check it out",
        url: "#"
      }
    }
  ];

  return (
    <div className="h-[844px] w-[390px] mx-auto flex flex-col items-center bg-black overflow-hidden">
      {/* App Frame */}
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-white">My Tradr</h1>
          <button 
            onClick={() => router.push('/settings')} 
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4">
          {/* URL Display */}
          {profile && (
            <div className="mb-4">
              <CopyableUrl username={profile.username} />
            </div>
          )}

          {/* Profile Content */}
          <div className="flex-1">
            {profile && (
              <ProfilePreview
                username={profile.username || currentUser?.email?.split('@')[0] || 'cryptowhale'}
                avatarUrl={profile.avatar_url}
                bio={profile.bio || 'NFT Collector | DeFi Explorer | Web3 Native 🌊'}
                tags={profile.tags || ['#NFTTrader', '#DeFiWhale', '#Web3']}
                strategies={mockStrategies}
                links={mockLinks}
                onThemeClick={() => {}}
                onEditClick={() => router.push('/onboarding')}
                onShareClick={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 