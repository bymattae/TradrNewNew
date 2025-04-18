'use client';

import { Dialog } from '@headlessui/react';
import Image from 'next/image';

interface ProfilePreviewProps {
  username: string;
  isVerified: boolean;
  avatarUrl: string;
  bio: string;
  hashtags: string[];
  strategies: string[];
}

export default function ProfilePreview({
  username,
  isVerified,
  avatarUrl,
  bio,
  hashtags,
  strategies,
}: ProfilePreviewProps) {
  return (
    <Dialog
      open={true}
      onClose={() => {}}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
    >
      <Dialog.Panel className="w-full max-w-lg bg-zinc-900 rounded-xl shadow-xl overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Profile Preview</h2>
            <button
              onClick={() => {}}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {/* Avatar and Username */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-800">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">@{username || 'username'}</h3>
                  {isVerified && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-500">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-400">tradr.co/{username || 'username'}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400">Bio</h4>
              <p className="text-white whitespace-pre-wrap">{bio || 'No bio yet'}</p>
            </div>

            {/* Hashtags */}
            {hashtags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trading Strategies */}
            {strategies.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Trading Strategies</h4>
                <div className="flex flex-wrap gap-2">
                  {strategies.map((strategy, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm"
                    >
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
} 