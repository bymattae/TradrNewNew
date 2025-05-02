import { useRouter, usePathname } from 'next/navigation';
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around bg-black/90 backdrop-blur-lg px-6 py-4 border-t border-zinc-900">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex items-center justify-center p-2 ${
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
    </div>
  );
} 