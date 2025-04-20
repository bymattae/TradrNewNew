'use client';

import Image from 'next/image';
import Link from 'next/link';

interface SocialLink {
  platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'telegram';
  url: string;
}

interface ProfilePreviewProps {
  username: string;
  bio?: string;
  tags: string[];
  avatarUrl?: string;
  socialLinks?: SocialLink[];
  strategies?: {
    title: string;
    stats: {
      gain: number;
      winRate: number;
      riskRatio: string;
    };
  }[];
  links?: {
    title: string;
    description: string;
    cta: {
      text: string;
      url: string;
    };
  }[];
}

const SocialIcons = {
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  telegram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
};

export default function ProfilePreview({
  username,
  bio,
  tags,
  avatarUrl,
  socialLinks,
  strategies,
  links
}: ProfilePreviewProps) {
  return (
    <div className="w-full max-w-lg mx-auto bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-xl">
      {/* Header Section */}
      <div className="relative px-6 pt-8 pb-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 animate-pulse" />
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={username}
                fill
                className="object-cover rounded-full border-4 border-black"
                sizes="112px"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center">
                <span className="text-4xl text-zinc-600">{username.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Username and Bio */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-white">{username}</h1>
            {bio && <p className="text-gray-400 text-base max-w-sm">{bio}</p>}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm border border-indigo-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all"
                >
                  {SocialIcons[link.platform]}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strategies Section */}
      {strategies && strategies.length > 0 && (
        <div className="border-t border-zinc-800/50 px-6 py-6">
          <h2 className="text-lg font-semibold text-white mb-4">Strategies</h2>
          <div className="space-y-4">
            {strategies.map((strategy, index) => (
              <div key={index} className="bg-zinc-800/30 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3">{strategy.title}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Gain</p>
                    <p className="text-lg font-semibold text-white">{strategy.stats.gain}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <p className="text-lg font-semibold text-white">{strategy.stats.winRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Risk Ratio</p>
                    <p className="text-lg font-semibold text-white">{strategy.stats.riskRatio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links Section */}
      {links && links.length > 0 && (
        <div className="border-t border-zinc-800/50 px-6 py-6">
          <h2 className="text-lg font-semibold text-white mb-4">Links</h2>
          <div className="space-y-4">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.cta.url}
                className="block bg-zinc-800/30 rounded-xl p-4 hover:bg-zinc-800/50 transition-all"
              >
                <h3 className="text-white font-medium">{link.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                <div className="flex items-center gap-2 text-indigo-400 text-sm mt-3">
                  <span>{link.cta.text}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 