import { Metadata } from 'next';
import { Settings, Edit2, Share2, Palette, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Tradr',
  description: 'Your personal trading profile',
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-black text-white px-5 py-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tradr</h1>
        <Settings className="w-6 h-6" />
      </div>

      {/* Live URL Card */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            <span className="text-sm text-[var(--text-secondary)]">Your Tradr is live:</span>
          </div>
          <button className="text-[var(--text-secondary)]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
        <a href="#" className="text-[var(--brand-purple)] text-sm">tradr.co/@@matt</a>
      </div>

      {/* Profile Card */}
      <div className="card p-6 mb-4">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-20 h-20 bg-[var(--brand-purple)] rounded-full mb-4 flex items-center justify-center text-xl font-semibold">
            Profile
          </div>
          
          {/* Username */}
          <h2 className="text-xl font-bold mb-2">mattjames.eth</h2>
          
          {/* Bio */}
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            I&apos;m a proffesional trader from Cardiff looking to level up my skills in trading.
          </p>
          
          {/* Tags */}
          <div className="flex gap-2 mb-6">
            <span className="tag">#crypto</span>
            <span className="tag">#defi</span>
            <span className="tag">#trading</span>
          </div>
          
          {/* Stats */}
          <div className="stats-grid">
            <div className="text-center">
              <div className="stats-value text-[var(--brand-green)]">+47%</div>
              <div className="stats-label">Gain</div>
            </div>
            <div className="text-center">
              <div className="stats-value">89%</div>
              <div className="stats-label">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="stats-value">2.5</div>
              <div className="stats-label">Risk Ratio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Strategy Card */}
      <div className="card p-6 mb-4">
        <h3 className="text-xl font-bold mb-2">Premium Strategy Course</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-6">
          I&apos;m a proffesional trader from Cardiff looking to level up my skills in trading.
        </p>
        <button className="btn-primary">
          Get Access Now
        </button>
      </div>

      {/* Powered by Tradr */}
      <div className="text-[var(--text-secondary)] text-sm mb-20">
        powered by tradr
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <div className="flex justify-center gap-4">
          <button className="btn-action">
            <Edit2 className="w-5 h-5" />
            <span className="btn-action-label">Edit</span>
          </button>
          <button className="btn-action">
            <Share2 className="w-5 h-5" />
            <span className="btn-action-label">Share</span>
          </button>
          <button className="btn-action">
            <Palette className="w-5 h-5" />
            <span className="btn-action-label">Theme</span>
          </button>
        </div>
      </div>
    </main>
  );
} 