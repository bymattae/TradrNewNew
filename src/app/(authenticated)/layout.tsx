'use client';

import { ReactNode, useState } from 'react';
import HubButton from '@/app/components/HubButton';
import HubMenu from '@/app/components/HubMenu';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const [isHubMenuOpen, setIsHubMenuOpen] = useState(false);

  return (
    <div className="h-[100dvh] overflow-hidden bg-black flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <HubButton onClick={() => setIsHubMenuOpen(true)} />
      <HubMenu isOpen={isHubMenuOpen} onClose={() => setIsHubMenuOpen(false)} />
    </div>
  );
} 