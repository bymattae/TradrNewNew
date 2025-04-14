'use client';

import { createContext, useContext, useEffect } from 'react';

interface EnvContextType {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
}

const EnvContext = createContext<EnvContextType>({});

export function EnvProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set environment variables on window object
    if (typeof window !== 'undefined') {
      window.ENV = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      };
    }
  }, []);

  return <>{children}</>;
}

export const useEnv = () => useContext(EnvContext); 