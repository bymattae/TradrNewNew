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
    <div className="h-[100dvh] max-h-[100dvh] bg-black overflow-hidden flex flex-col">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      <NavigationBar />
    </div>
  );
} 