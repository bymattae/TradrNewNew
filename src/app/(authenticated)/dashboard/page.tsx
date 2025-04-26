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
    <div className="h-full flex flex-col pt-2 px-4 pb-2">
      <div className="max-w-lg mx-auto w-full flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-white">My Tradr</h1>
          <button 
            onClick={() => router.push('/settings')} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* URL Display */}
        {profile && (
          <div className="mb-3">
            <CopyableUrl username={profile.username} />
          </div>
        )}

        {/* Profile Preview - Natural sizing */}
        {profile && (
          <div className="mb-3">
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
          </div>
        )}
      </div>
    </div>
  );
} 