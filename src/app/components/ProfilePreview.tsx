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
  links,
  onThemeClick,
  onEditClick,
  onShareClick
}: ProfilePreviewProps & {
  onThemeClick?: () => void;
  onEditClick?: () => void;
  onShareClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-lg p-4">
        {/* Card Outline & Glow Effects */}
        <div className="absolute inset-2 bg-gradient-to-b from-violet-500/30 to-violet-400/20 rounded-[2.5rem] blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-violet-400/5 to-transparent rounded-[2.5rem]" />
        
        {/* Main Card */}
        <div className="relative bg-gradient-to-b from-black/95 via-black/90 to-black/95 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          {/* Content */}
          <div className="px-8 py-6">
            {/* Avatar and Username Section */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-3">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 via-violet-400 to-violet-500/50 rounded-full animate-gradient-xy" />
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    fill
                    className="object-cover rounded-full border-2 border-black/50 relative"
                    sizes="80px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-black/50 border-2 border-white/10 relative flex items-center justify-center">
                    <span className="text-3xl font-display text-gray-400">{username.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                {/* Online Status Badge */}
                <div className="absolute -bottom-1 -right-1 bg-profit rounded-full w-3 h-3 border-2 border-black shadow-lg" />
              </div>

              {/* Username and Bio */}
              <div className="text-center space-y-2">
                <h1 className="text-xl font-display font-medium text-white">@{username}</h1>
                {bio && <p className="font-mono text-sm text-gray-400 max-w-sm tracking-tight leading-relaxed">{bio}</p>}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {tags.map((tag, index) => {
                    const gradients = [
                      'from-violet-500/90 to-violet-700/90',
                      'from-blue-900/90 to-blue-950/90',
                      'from-emerald-600/90 to-emerald-800/90'
                    ];
                    return (
                      <span
                        key={index}
                        className={`bg-gradient-to-br ${gradients[index]} px-3 py-1 rounded-lg text-xs font-medium shadow-lg transition-all hover:scale-105 border border-white/10`}
                      >
                        #{tag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stats Section */}
            {strategies && strategies.length > 0 && (
              <div className="mt-6">
                <div className="bg-black/50 backdrop-blur rounded-xl p-3 border border-white/10 shadow-lg">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className={`font-mono text-lg font-medium tabular-nums ${strategies[0].stats.gain >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {strategies[0].stats.gain >= 0 ? '+' : ''}{strategies[0].stats.gain}%
                      </p>
                      <p className="text-xs text-gray-500">Gain</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-lg font-medium text-white tabular-nums">{strategies[0].stats.winRate}%</p>
                      <p className="text-xs text-gray-500">Win Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-lg font-medium text-violet-400 tabular-nums">{strategies[0].stats.riskRatio}</p>
                      <p className="text-xs text-gray-500">Avg RR</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Links Section */}
            {links && links.length > 0 && (
              <div className="mt-4">
                {links.map((link, index) => (
                  <div key={index} className="bg-black/50 backdrop-blur rounded-xl p-4 border border-white/10 shadow-lg">
                    <div className="flex flex-col space-y-1 mb-3">
                      <h3 className="text-base font-display text-white/90">{link.title}</h3>
                      <p className="text-xs text-gray-400 font-medium">{link.description}</p>
                    </div>
                    <Link
                      href={link.cta.url}
                      className="group flex items-center justify-between bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-3 py-2 rounded-lg font-display text-sm transition-all active:scale-[0.99] border border-violet-500/20"
                    >
                      <span className="font-medium">{link.cta.text}</span>
                      <svg 
                        className="w-4 h-4 text-violet-400 transition-transform group-hover:translate-x-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Powered by Tradr */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="bg-[#0F0F12] rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-white/90 font-medium border border-white/10 shadow-lg">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.4 6.1L14.5 11l4.9 4.9c.3.3.3.7 0 1-.1.1-.3.2-.5.2s-.4-.1-.5-.2l-4.9-4.9-4.9 4.9c-.1.1-.3.2-.5.2s-.4-.1-.5-.2c-.3-.3-.3-.7 0-1l4.9-4.9-4.9-4.9c-.3-.3-.3-.7 0-1 .3-.3.7-.3 1 0l4.9 4.9 4.9-4.9c.3-.3.7-.3 1 0 .3.3.3.7 0 1z"/>
                </svg>
                Powered by Tradr
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-center gap-3">
        <button 
          onClick={onEditClick}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card/50 hover:bg-surface-card border border-white/5 transition-all"
        >
          <svg className="w-4 h-4 text-white/50 group-hover:text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="text-sm font-medium text-white/70 group-hover:text-white/90">Edit</span>
        </button>

        <button 
          onClick={onShareClick}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card/50 hover:bg-surface-card border border-white/5 transition-all"
        >
          <svg className="w-4 h-4 text-white/50 group-hover:text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span className="text-sm font-medium text-white/70 group-hover:text-white/90">Share</span>
        </button>

        <button 
          onClick={onThemeClick}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card/50 hover:bg-surface-card border border-white/5 transition-all"
        >
          <svg className="w-4 h-4 text-white/50 group-hover:text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-sm font-medium text-white/70 group-hover:text-white/90">Theme</span>
        </button>
      </div>
    </div>
  );
} 