'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import ProfilePreview from '@/app/components/ProfilePreview';
import CopyableUrl from '@/app/components/CopyableUrl';
import { User } from '@supabase/supabase-js';
import { Settings } from 'lucide-react';
import { IoGridOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

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
        {/* Top Navigation Bar */}
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
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4 py-4 overflow-y-auto scrollbar-hide">
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
                bio={profile.bio || 'I\'m a trader from germany'}
                tags={profile.tags || ['#Coolman']}
                strategies={mockStrategies}
                links={mockLinks}
                onThemeClick={() => {}}
                onEditClick={() => router.push('/onboarding')}
                onShareClick={() => {}}
              />
            )}
          </div>
        </div>
        
        {/* Hub Button (Fixed Position) */}
        <div className="fixed left-6 bottom-6 z-50">
          <motion.button
            className="relative p-3.5 rounded-full bg-[#7B61FF] hover:bg-[#8B74FF] transition-colors shadow-[0_4px_20px_rgba(123,97,255,0.5)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <IoGridOutline className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
} 