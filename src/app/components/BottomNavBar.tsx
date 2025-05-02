import { useRouter, usePathname } from 'next/navigation';
import { Home, BarChart2, Trophy, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import getSupabaseBrowserClient from '@/lib/supabase/client';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const supabase = getSupabaseBrowserClient();
  
  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single();
          
          if (profile?.avatar_url) {
            setAvatarUrl(profile.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };
    
    fetchUserAvatar();
  }, [supabase]);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-zinc-800/50">
      <div className="max-w-md mx-auto flex justify-between">
        <button
          onClick={() => router.push('/dashboard')}
          className={`flex-1 py-4 flex flex-col items-center justify-center ${
            pathname === '/dashboard' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <Home className="w-6 h-6" strokeWidth={1.5} />
        </button>
        
        <button
          onClick={() => router.push('/strategy')}
          className={`flex-1 py-4 flex flex-col items-center justify-center ${
            pathname === '/strategy' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <BarChart2 className="w-6 h-6" strokeWidth={1.5} />
        </button>
        
        <button
          onClick={() => router.push('/leaderboard')}
          className={`flex-1 py-4 flex flex-col items-center justify-center ${
            pathname === '/leaderboard' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          <Trophy className="w-6 h-6" strokeWidth={1.5} />
        </button>
        
        <button
          onClick={() => router.push('/profile')}
          className={`flex-1 py-4 flex flex-col items-center justify-center ${
            pathname === '/profile' ? 'text-white' : 'text-zinc-500'
          }`}
        >
          {avatarUrl ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={avatarUrl}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <User className="w-6 h-6" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
} 