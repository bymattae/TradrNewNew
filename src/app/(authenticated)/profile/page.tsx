'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/profile';
import ProfileCard from '@/app/components/ProfileCard';
import CopyableUrl from '@/app/components/CopyableUrl';
import { Settings } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/join');
          return;
        }
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        router.push('/auth/join');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router, supabase]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-white">No profile found.</div>;
  }

  return (
    <main className="h-[844px] w-full bg-black text-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full bg-[#080808] shadow-sm">
        <div className="w-full mx-auto px-4 py-3 flex justify-between items-center">
          <div className="w-6"></div> {/* Spacer for centering */}
          <h1 className="text-lg font-bold text-white">My Tradr</h1>
          <button className="w-6 h-6 flex items-center justify-center text-white/80 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content container with consistent spacing */}
      <div className="w-full px-4 flex-1 flex flex-col gap-6 pt-6">
        {/* Live URL Card - Using the CopyableUrl component */}
        <CopyableUrl username={profile.username} />

        {/* Profile Card - Scaled down slightly */}
        <div className="transform scale-[0.98]">
          <ProfileCard 
            username={profile.username || ''}
            bio={profile.bio || ''}
            avatar_url={profile.avatar_url || ''}
            hashtags={profile.hashtags || []}
          />
        </div>
      </div>
    </main>
  );
} 