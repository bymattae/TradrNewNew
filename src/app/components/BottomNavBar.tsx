import { useRouter, usePathname } from 'next/navigation';
import { Home, BarChart2 } from 'lucide-react';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black">
      <div className="flex justify-center border-t border-zinc-800/50">
        <div className="w-full max-w-lg flex">
          <button
            onClick={() => router.push('/dashboard')}
            className={`flex-1 py-5 flex items-center justify-center ${
              pathname === '/dashboard' ? 'text-white' : 'text-zinc-500'
            }`}
          >
            <Home className="w-7 h-7" strokeWidth={1} />
          </button>
          <button
            onClick={() => router.push('/strategy')}
            className={`flex-1 py-5 flex items-center justify-center ${
              pathname === '/strategy' ? 'text-white' : 'text-zinc-500'
            }`}
          >
            <BarChart2 className="w-7 h-7" strokeWidth={1} />
          </button>
        </div>
      </div>
    </div>
  );
} 