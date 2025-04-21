'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import ProfilePreview from '@/app/components/ProfilePreview';
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
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-white">My Tradr</h1>

        {/* Profile Preview */}
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
    </div>
  );
} 