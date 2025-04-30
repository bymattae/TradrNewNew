import ShareBlock from '@/components/blocks/ShareBlock';
import Footer from '@/components/blocks/Footer';
import { Calculator } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // We'll use a hardcoded username for now, we'll integrate with Supabase later
  const dummyUsername = 'demo';

  return (
    // Main container with exact viewport height and background
    <div className="relative flex h-[100dvh] w-full flex-col bg-black px-4 pt-12">
      {/* Content container with max width and auto margins */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {/* Main content area with consistent spacing */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Share Block Card */}
          <div className="w-full rounded-2xl bg-[#141414] p-4 shadow-lg">
            <ShareBlock username={dummyUsername} />
          </div>
          
          {/* Profile Card */}
          <div className="flex-1 rounded-2xl bg-[#141414] p-4 shadow-lg">
            {children}
          </div>

          {/* Stats Card */}
          <div className="w-full rounded-2xl bg-[#141414] p-4 shadow-lg">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-[#00FF88]">+12.5%</div>
                <div className="text-sm text-gray-400">Gain</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">89%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#7000FF]">1:3</div>
                <div className="text-sm text-gray-400">Avg RR</div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="w-full rounded-2xl bg-[#141414] p-4 shadow-lg">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-white">
                Join my free telegram channel!
              </h2>
              <p className="text-sm text-gray-400">
                Get involved with other alphas and start scaling. This is your time right now.
              </p>
              <button className="w-full rounded-xl bg-[#7000FF] py-3 text-base font-medium text-white">
                Join Channel
              </button>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="py-4 text-center text-sm text-gray-600">
          Powered by Tradr
        </div>
      </div>

      {/* Floating calculator button */}
      <button className="absolute bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#7000FF]">
        <Calculator className="h-5 w-5 text-white" />
      </button>
    </div>
  );
} 