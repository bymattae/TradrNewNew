'use client';

import { Dialog } from '@headlessui/react';
import ProfilePreview from './ProfilePreview';
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
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-violet-900 p-1">
              <Image
                src={avatar}
                alt={username}
                width={96}
                height={96}
                className="h-full w-full rounded-full object-cover"
                priority
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{username}</h2>
            <p className="mt-2 text-center text-sm text-zinc-400">{bio}</p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socialLinks.map(({ platform, url }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 transition-colors hover:text-violet-400"
                  >
                    {SocialIcons[platform]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 