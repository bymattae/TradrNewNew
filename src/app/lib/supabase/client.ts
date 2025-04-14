import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookies = document.cookie.split(';');
          for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key.trim() === name) return value;
          }
          return undefined;
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          document.cookie = `${name}=${value}${options.path ? `; path=${options.path}` : ''}${
            options.maxAge ? `; max-age=${options.maxAge}` : ''
          }${options.domain ? `; domain=${options.domain}` : ''}${
            options.secure ? '; secure' : ''
          }`;
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          document.cookie = `${name}=; path=${options.path || '/'}${
            options.domain ? `; domain=${options.domain}` : ''
          }; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        },
      },
    }
  );
}; 