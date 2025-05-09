'use client';

import { Dialog } from '@headlessui/react';
import ProfileCard from './ProfileCard';
import Image from 'next/image';
import { SocialIcons } from '@/lib/SocialIcons';

interface ProfilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  bio: string;
  avatar: string;
  socialLinks: Array<{
    platform: keyof typeof SocialIcons;
    url: string;
  }>;
}

export function ProfilePreviewDialog({
  isOpen,
  onClose,
  username,
  bio,
  avatar,
  socialLinks
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
            avatar_url={avatar}
            hashtags={[]}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 