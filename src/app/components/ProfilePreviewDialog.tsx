'use client';

import { Dialog } from '@headlessui/react';
import ProfileCard from './ProfileCard';

interface ProfilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  bio: string;
  avatar_url: string;
  hashtags: string[];
}

export function ProfilePreviewDialog({
  isOpen,
  onClose,
  username,
  bio,
  avatar_url,
  hashtags
}: ProfilePreviewDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-3xl bg-zinc-900 p-6 shadow-xl">
          <ProfileCard
            username={username}
            bio={bio}
            avatar_url={avatar_url}
            hashtags={hashtags}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 