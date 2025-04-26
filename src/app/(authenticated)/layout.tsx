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
    <div className="min-h-screen bg-black pb-20">
      {children}
      <NavigationBar />
    </div>
  );
} 