import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BarChart2, Trophy, User } from 'lucide-react';
import Image from 'next/image';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface BottomNavBarProps {
  onOpenHubMenu?: () => void;
}

type NavItem = {
  icon?: LucideIcon;
  type?: string;
  href: string;
  action: () => void;
  label: string;
}

export default function BottomNavBar({ onOpenHubMenu }: BottomNavBarProps) {
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
  
  const navItems: NavItem[] = [
    {
      icon: Home,
      href: '/dashboard',
      action: () => router.push('/dashboard'),
      label: 'Home'
    },
    {
      icon: BarChart2,
      href: '/strategy',
      action: () => router.push('/strategy'),
      label: 'Strategies'
    },
    {
      icon: Trophy,
      href: '/leaderboard',
      action: () => router.push('/leaderboard'),
      label: 'Leaderboard'
    },
    {
      type: 'avatar',
      href: '/profile',
      action: () => router.push('/profile'),
      label: 'Profile'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-full bg-black/90 backdrop-blur-md border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-center space-x-16">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          if (item.type === 'avatar') {
            return (
              <motion.button
                key={index}
                onClick={item.action}
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center justify-center"
              >
                <div className={`w-6 h-6 rounded-full overflow-hidden border ${isActive ? 'border-white' : 'border-transparent'}`}>
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  )}
                </div>
              </motion.button>
            );
          }
          
          const IconComponent = item.icon;
          return (
            <motion.button
              key={index}
              onClick={item.action}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {IconComponent && <IconComponent className="w-6 h-6" strokeWidth={1.5} />}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
} 