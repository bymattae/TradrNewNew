'use client';

import { Dialog } from '@headlessui/react';
import ProfilePreview from './ProfilePreview';

interface ProfilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  isVerified: boolean;
  avatarUrl: string;
  bio: string;
  hashtags: string[];
  strategies: Array<{
    name: string;
    gain: number;
    winRate: number;
    riskRatio: number;
  }>;
  currentStrategyIndex?: number;
}

export default function ProfilePreviewDialog({
  isOpen,
  onClose,
  username,
  isVerified,
  avatarUrl,
  bio,
  hashtags,
  strategies,
  currentStrategyIndex,
}: ProfilePreviewDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
    >
      <Dialog.Panel className="w-full max-w-lg bg-zinc-900 rounded-xl shadow-xl overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Profile Preview</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ProfilePreview
            username={username}
            isVerified={isVerified}
            avatarUrl={avatarUrl}
            bio={bio}
            hashtags={hashtags}
            strategies={strategies}
            currentStrategyIndex={currentStrategyIndex}
          />
        </div>
      </Dialog.Panel>
    </Dialog>
  );
} 