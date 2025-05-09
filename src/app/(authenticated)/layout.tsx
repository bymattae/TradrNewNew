'use client';

import { ReactNode, useState } from 'react';
import HubMenu from '@/app/components/HubMenu';
import BottomNavBar from '@/app/components/BottomNavBar';
import { usePathname } from 'next/navigation';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const [isHubMenuOpen, setIsHubMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-black flex flex-col">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      {pathname !== '/profile/edit' && <BottomNavBar />}
      <HubMenu isOpen={isHubMenuOpen} onClose={() => setIsHubMenuOpen(false)} />
    </div>
  );
} 