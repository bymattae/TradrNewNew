import { Metadata } from 'next';
import { Settings, Edit2, Share2, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Tradr',
  description: 'Your personal trading profile',
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-black text-white p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tradr</h1>
        <Settings className="w-6 h-6" />
      </div>

      {/* Live URL Card */}
      <div className="bg-[#111111] rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Your Tradr is live:</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <a href="#" className="text-purple-500 text-sm">tradr.co/@@matt</a>
        </div>
        <button className="text-gray-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-[#111111] rounded-xl p-6 mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-purple-600 rounded-full mb-4 flex items-center justify-center text-2xl font-bold">
            P
          </div>
          <h2 className="text-xl font-bold mb-1">mattjames.eth</h2>
          <p className="text-gray-400 text-sm mb-4">
            I&apos;m a professional trader from Cardiff looking to level up my skills in trading.
          </p>
          <div className="flex gap-2 mb-6">
            <span className="bg-[#222222] px-3 py-1 rounded-full text-xs">#crypto</span>
            <span className="bg-[#222222] px-3 py-1 rounded-full text-xs">#defi</span>
            <span className="bg-[#222222] px-3 py-1 rounded-full text-xs">#trading</span>
          </div>
          <div className="grid grid-cols-3 w-full bg-[#0A0A0A] rounded-xl p-4 gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-green-500">+47%</div>
              <div className="text-xs text-gray-400">Gain</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">89%</div>
              <div className="text-xs text-gray-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">2.5</div>
              <div className="text-xs text-gray-400">Risk Ratio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Strategy Card */}
      <div className="bg-[#111111] rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold mb-2">Premium Strategy Course</h3>
        <p className="text-gray-400 text-sm mb-4">
          I&apos;m a professional trader from Cardiff looking to level up my skills in trading.
        </p>
        <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
          Get Access Now
        </button>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <div className="flex justify-center gap-4">
          <button className="bg-[#111111] p-4 rounded-xl">
            <Edit2 className="w-5 h-5" />
          </button>
          <button className="bg-[#111111] p-4 rounded-xl">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="bg-[#111111] p-4 rounded-xl">
            <Palette className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
} 