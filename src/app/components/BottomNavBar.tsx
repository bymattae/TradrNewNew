import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Grid, Heart, MessageCircle, User } from 'lucide-react';

interface BottomNavBarProps {
  onOpenHubMenu?: () => void;
}

export default function BottomNavBar({ onOpenHubMenu }: BottomNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems = [
    {
      icon: Home,
      href: '/dashboard',
      action: () => router.push('/dashboard')
    },
    {
      icon: Grid,
      href: '/hub',
      action: () => onOpenHubMenu?.()
    },
    {
      icon: Heart,
      href: '/favorites',
      action: () => router.push('/favorites')
    },
    {
      icon: MessageCircle,
      href: '/messages',
      action: () => router.push('/messages')
    },
    {
      icon: User,
      href: '/profile',
      action: () => router.push('/profile')
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-black/90 backdrop-blur-md border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between space-x-8 sm:space-x-12">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.button
              key={index}
              onClick={item.action}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'text-white bg-white/10' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
} 