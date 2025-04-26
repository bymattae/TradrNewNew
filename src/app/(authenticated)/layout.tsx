'use client';

import { ReactNode } from 'react';
import NavigationBar from '@/app/components/NavigationBar';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    <div className="h-[100vh] h-[100dvh] overflow-hidden bg-black flex flex-col">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      <div className="pb-[env(safe-area-inset-bottom)]">
        <NavigationBar />
      </div>
    </div>
  );
} 