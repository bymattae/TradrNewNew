'use client';

import { motion } from 'framer-motion';
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
  onEditClick: () => void;
  onShareClick: () => void;
  onThemeClick: () => void;
}

const SocialIcons = {
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.321.072.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
  onEditClick,
  onShareClick,
  onThemeClick
}: ProfilePreviewProps) {
  return (
    <div className="relative">
      {/* LED Outline Animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(
            from 0deg at 50% 50%,
            rgba(167, 139, 250, 0.5),
            rgba(139, 92, 246, 0.5),
            rgba(124, 58, 237, 0.5),
            rgba(139, 92, 246, 0.5),
            rgba(167, 139, 250, 0.5)
          )`,
          filter: 'blur(20px)',
          opacity: 0.5
        }}
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main Card */}
      <div className="relative bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="p-4 space-y-3">
          {/* Profile Header */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-violet-500/20">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-violet-500">
                    {username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white tracking-tight">
                @{username}
              </h2>
              {bio && (
                <p className="text-white/60 font-sans mt-0.5 text-sm leading-relaxed line-clamp-2">
                  {bio}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-white/80 font-medium hover:bg-white/10 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Profile Section Divider */}
          <div className="border-t border-neutral-700/40" />

          {/* Strategies */}
          {strategies && strategies.length > 0 && (
            <div className="space-y-2">
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors"
                >
                  <h3 className="font-display text-sm font-semibold text-white mb-1">
                    {strategy.title}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">Gain</p>
                      <p className="font-mono text-green-400 font-medium text-sm">
                        +{strategy.stats.gain}%
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">Win Rate</p>
                      <p className="font-mono text-white font-medium text-sm">
                        {strategy.stats.winRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">Risk Ratio</p>
                      <p className="font-mono text-white font-medium text-sm">
                        {strategy.stats.riskRatio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strategy Section Divider */}
          {strategies && strategies.length > 0 && (
            <div className="border-t border-neutral-700/40" />
          )}

          {/* Links */}
          {links && links.length > 0 && (
            <div className="space-y-2">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.cta.url}
                  className="block bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors"
                >
                  <h3 className="font-display text-sm font-semibold text-white">
                    {link.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-0.5 line-clamp-2">
                    {link.description}
                  </p>
                  <span className="inline-block mt-1 text-violet-400 text-xs font-medium">
                    {link.cta.text} →
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Links Section Divider */}
          {links && links.length > 0 && (
            <div className="border-t border-neutral-700/40" />
          )}

          {/* Powered by Tradr */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <div className="relative w-3.5 h-3.5 flex-shrink-0">
                <Image
                  src="https://rnfvzaelmwbbvfbsppir.supabase.co/storage/v1/object/public/assets/TradrIcon%20(1).png"
                  alt="Tradr"
                  fill
                  sizes="14px"
                  className="object-contain"
                  priority
                />
              </div>
              <span>Powered by</span>
              <span className="font-medium">Tradr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons with Glow */}
      <div className="relative mt-3">
        <div className="absolute inset-0 bg-neutral-800/30 backdrop-blur-md rounded-2xl" />
        <div className="relative flex items-center justify-center gap-6 p-2">
          <motion.button
            onClick={onEditClick}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors group"
            whileTap={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
          >
            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-xs font-medium">Edit</span>
          </motion.button>
          <motion.button
            onClick={onShareClick}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors group"
            whileTap={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
          >
            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-xs font-medium">Share</span>
          </motion.button>
          <motion.button
            onClick={onThemeClick}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors group"
            whileTap={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
          >
            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span className="text-xs font-medium">Theme</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
} 