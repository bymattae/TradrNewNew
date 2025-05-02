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
    <div 
      className="fixed left-0 right-0 z-50 px-6 pb-safe" 
      style={{ 
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))', 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
      }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between bg-[#1C1C24]/90 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg border border-[#2A2B30]/30">
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
      className={`p-2 transition-colors duration-200 ${
        isActive 
          ? 'bg-purple-500 text-white rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
          : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {icon}
    </button>
  );
} 