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
    <div className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between bg-black rounded-full px-8 py-3 shadow-lg border border-zinc-800/30">
          <NavItem 
            icon={<Home className="w-6 h-6" strokeWidth={1.5} />} 
            isActive={pathname === '/dashboard'}
            onClick={() => router.push('/dashboard')}
          />
          
          <NavItem 
            icon={<BarChart2 className="w-6 h-6" strokeWidth={1.5} />}
            isActive={pathname === '/strategy'}
            onClick={() => router.push('/strategy')}
          />
          
          <NavItem 
            icon={<Trophy className="w-6 h-6" strokeWidth={1.5} />}
            isActive={pathname === '/leaderboard'}
            onClick={() => router.push('/leaderboard')}
          />
          
          <NavItem 
            icon={
              avatarUrl ? (
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
              )
            }
            isActive={pathname === '/profile'}
            onClick={() => router.push('/profile')}
          />
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 ${isActive ? 'bg-white text-black rounded-full' : 'text-zinc-500'}`}
    >
      {icon}
    </button>
  );
} 