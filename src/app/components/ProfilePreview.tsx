'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightLine } from 'react-icons/ri';

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
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[var(--brand-purple)]/20 blur-[100px] rounded-[100px]" />
      </div>

      <div className="card card-hover p-6">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] p-[1px]">
              <div className="w-full h-full rounded-full bg-[var(--button-background)] p-[2px]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--brand-primary)]">
                    {username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-title text-lg">
              @{username}
            </h3>
            {bio && (
              <p className="text-description text-sm">
                {bio}
              </p>
            )}
          </div>
          <button className="btn-action">
            <RiArrowRightLine className="w-5 h-5" />
          </button>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-[var(--button-background)] rounded-lg text-xs text-[var(--text-secondary)]
                  border border-[var(--divider)] backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Strategies */}
        {strategies && strategies.length > 0 && (
          <div className="mt-4">
            <div className="bg-[var(--button-background)] rounded-xl p-4">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[13px] text-[var(--text-secondary)] font-medium">Gain</p>
                  <p className="text-[15px] font-semibold text-[var(--text-primary)] mt-1.5">
                    +{strategies[0].stats.gain}%
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[var(--text-secondary)] font-medium">Win Rate</p>
                  <p className="text-[15px] font-semibold text-[var(--text-primary)] mt-1.5">
                    {strategies[0].stats.winRate}%
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[var(--text-secondary)] font-medium">Risk Ratio</p>
                  <p className="text-[15px] font-semibold text-[var(--text-primary)] mt-1.5">
                    {strategies[0].stats.riskRatio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        {links && links.length > 0 && (
          <div className="space-y-3 mt-7">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.cta.url}
                className="block bg-[var(--button-background)] rounded-xl p-4 border border-[var(--divider)]
                  backdrop-blur-sm hover:bg-[var(--button-background)] hover:border-[var(--brand-primary)]/20 
                  hover:shadow-[0px_4px_12px_rgba(123,79,255,0.15)] transition-all duration-200"
              >
                <h3 className="text-title text-sm">
                  {link.title}
                </h3>
                <p className="text-description text-xs mt-1 line-clamp-2">
                  {link.description}
                </p>
                <span className="inline-block mt-2 text-[var(--brand-secondary)] text-xs font-medium">
                  {link.cta.text} →
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Powered by Tradr */}
        <div className="mt-6 pt-4 border-t border-[var(--divider)]">
          <div className="flex items-center justify-center gap-1.5 text-[var(--text-secondary)] text-[11px]">
            <div className="relative w-3 h-3 flex-shrink-0">
              <Image
                src="https://rnfvzaelmwbbvfbsppir.supabase.co/storage/v1/object/public/assets/TradrIcon%20(1).png"
                alt="Tradr"
                fill
                sizes="12px"
                className="object-contain"
              />
            </div>
            <span>Powered by</span>
            <span className="font-medium">Tradr</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative mt-4">
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={onEditClick}
            className="btn-action"
            whileTap={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs font-medium">Edit</span>
          </motion.button>

          <motion.button
            onClick={onShareClick}
            className="btn-action"
            whileTap={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-xs font-medium">Share</span>
          </motion.button>

          <motion.button
            onClick={onThemeClick}
            className="btn-action"
            whileTap={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-xs font-medium">Theme</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
} 