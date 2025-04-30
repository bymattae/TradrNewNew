import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="flex h-16 items-center justify-between py-5">
      {/* Left spacer to match settings button width */}
      <div className="w-10" />
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-white">My Tradr</h1>
      
      {/* Settings button */}
      <button 
        onClick={() => router.push('/settings')}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/5 active:bg-white/10"
      >
        <Settings className="h-5 w-5 text-white" />
      </button>
    </div>
  );
} 