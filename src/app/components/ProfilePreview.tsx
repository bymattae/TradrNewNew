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
    <div className="w-full max-w-lg mx-auto bg-zinc-900/50 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-xl relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

      {/* Content */}
      <div className="relative">
        {/* Header Section */}
        <div className="relative px-6 pt-8 pb-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-6 group">
              {/* Animated gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
              
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={username}
                  fill
                  className="object-cover rounded-full border-[3px] border-black relative"
                  sizes="128px"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-800 border-[3px] border-black relative flex items-center justify-center">
                  <span className="text-5xl text-zinc-600">{username.charAt(0).toUpperCase()}</span>
                </div>
              )}
              
              {/* Verified Badge */}
              <div className="absolute bottom-0 right-0 bg-black rounded-full p-1 border-2 border-black">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full p-1 animate-pulse">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Username and Bio */}
            <div className="text-center space-y-3 mb-6">
              <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">{username}</h1>
              {bio && <p className="text-gray-400 text-base max-w-sm leading-relaxed">{bio}</p>}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-colors cursor-default"
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
                    className="w-11 h-11 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:scale-110 transition-all duration-200"
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
          <div className="border-t border-zinc-800/50 px-6 py-6 bg-black/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-400">
                <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zM13.25 5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5a.75.75 0 01.75-.75zm-6.5 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 016.75 9zm4-1.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clipRule="evenodd" />
              </svg>
              Strategies
            </h2>
            <div className="space-y-4">
              {strategies.map((strategy, index) => (
                <div key={index} className="bg-zinc-800/30 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors">
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
          <div className="border-t border-zinc-800/50 px-6 py-6 bg-black/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-400">
                <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
              </svg>
              Links
            </h2>
            <div className="space-y-4">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.cta.url}
                  className="block bg-zinc-800/30 rounded-xl p-4 hover:bg-zinc-800/50 transition-all hover:scale-[1.02] duration-200"
                >
                  <h3 className="text-white font-medium">{link.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                  <div className="flex items-center gap-2 text-indigo-400 text-sm mt-3 group">
                    <span className="group-hover:underline">{link.cta.text}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Powered by Tradr */}
        <div className="text-center py-4 text-sm text-gray-500">
          Powered by Tradr
        </div>
      </div>
    </div>
  );
} 