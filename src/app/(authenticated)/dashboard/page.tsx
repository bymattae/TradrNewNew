'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import ProfilePreview from '@/app/components/ProfilePreview';
import CopyableUrl from '@/app/components/CopyableUrl';
import { User } from '@supabase/supabase-js';

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
        gain: 31.2,
        winRate: 72,
        riskRatio: "1:3"
      }
    }
  ];

  const mockLinks = [
    {
      title: "Premium Strategy Course",
      description: "Learn the complete strategy with detailed explanations and live examples",
      cta: {
        text: "Get Access Now",
        url: "#"
      }
    }
  ];

  return (
    <div className="h-[100dvh] flex flex-col items-center bg-black px-4 py-4 overflow-hidden">
      <div className="w-full max-w-md flex flex-col h-full">
        {/* Top Section - Header */}
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-2xl font-bold text-white text-center">Your Trading Identity</h1>
        </div>

        {/* URL Display */}
        {profile && (
          <div className="mb-4">
            <CopyableUrl username={profile.username} />
          </div>
        )}

        {/* Centered Content Area - Fills available space */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {profile && (
            <ProfilePreview
              username={profile.username || currentUser?.email?.split('@')[0] || 'trader'}
              avatarUrl={profile.avatar_url}
              bio={profile.bio}
              tags={profile.tags || []}
              strategies={mockStrategies}
              links={mockLinks}
              onThemeClick={() => {}}
              onEditClick={() => router.push('/onboarding')}
              onShareClick={() => {}}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-2 mb-2">
          <p className="text-xs text-gray-500">© 2024 Tradr App</p>
        </div>
      </div>
    </div>
  );
} 