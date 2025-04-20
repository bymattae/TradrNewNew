'use client';

import { Dialog } from '@headlessui/react';
import ProfilePreview from './ProfilePreview';

interface ProfilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  bio?: string;
  hashtags: string[];
  strategies: {
    title: string;
    description: string;
    cta: {
      text: string;
      url: string;
    };
  }[];
}

export default function ProfilePreviewDialog({
  isOpen,
  onClose,
  username,
  bio,
  hashtags,
  strategies
}: ProfilePreviewDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg">
          <ProfilePreview
            username={username}
            bio={bio}
            tags={hashtags}
            stats={{
              gain: 31.2,
              winRate: 72,
              riskRatio: "1:3"
            }}
            strategies={strategies}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 