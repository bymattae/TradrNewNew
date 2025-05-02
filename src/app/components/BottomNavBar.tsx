import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BarChart2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface BottomNavBarProps {
  onOpenHubMenu?: () => void;
}

type NavItem = {
  icon: LucideIcon;
  href: string;
  action: () => void;
}

export default function BottomNavBar({ onOpenHubMenu }: BottomNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      icon: Home,
      href: '/dashboard',
      action: () => router.push('/dashboard')
    },
    {
      icon: BarChart2,
      href: '/strategy',
      action: () => router.push('/strategy')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-zinc-900">
      <div className="flex items-center justify-between">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          
          return (
            <button
              key={index}
              onClick={item.action}
              className={`flex-1 py-4 flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'text-zinc-500'
              }`}
            >
              <IconComponent className="w-6 h-6" strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </div>
  );
} 