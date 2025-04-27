'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightLine } from 'react-icons/ri';
import { FiEdit, FiEdit3, FiShare2 } from 'react-icons/fi';
import { IoColorPaletteOutline, IoGridOutline } from 'react-icons/io5';
import HubButton from './HubButton';

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
  const tagColors: Record<string, string> = {
    '#NFTTrader': 'bg-[#6048B8]/25 text-[#9B7BFF]',
    '#DeFiWhale': 'bg-[#3047B8]/25 text-[#7B9BFF]',
    '#Web3': 'bg-[#0D9373]/25 text-[#4DFFC7]'
  };

  const getTagColor = (tag: string) => {
    return tagColors[tag] || 'bg-[#333]/50 text-white/70';
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Profile Card */}
      <div className="relative w-full flex flex-col items-center">
        <div className="w-full bg-[#151515] rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Info Section */}
          <div className="relative w-full bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] p-6 flex flex-col items-center">
            {/* Edit button */}
            <button 
              onClick={onEditClick}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            >
              <FiEdit className="w-4 h-4 text-white/80" />
            </button>
            
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-[#7048E8] to-[#9C48E8] p-[2px] shadow-[0_0_15px_rgba(123,97,255,0.5)]">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={avatarUrl || "/avatar.png"}
                    alt={username}
                    width={90}
                    height={90}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Status dot */}
              <div className="absolute -right-1 bottom-2 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#0D0D0D]"></div>
            </div>
            
            {/* Username */}
            <h2 className="text-2xl font-bold text-white mb-1">@{username}</h2>
            
            {/* Bio */}
            <p className="text-base text-white/70 text-center mb-3">{bio || 'Trader'}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {(tags || ['#NFTTrader', '#DeFiWhale', '#Web3']).map((tag) => (
                <span 
                  key={tag} 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#161616] rounded-xl py-3 px-2 text-center">
                <p className="text-[#4DFFC7] text-xl font-bold">+{strategies?.[0]?.stats.gain || 12.5}%</p>
                <p className="text-xs text-[#A0A0A0]">Gain</p>
              </div>
              <div className="bg-[#161616] rounded-xl py-3 px-2 text-center">
                <p className="text-white text-xl font-bold">{strategies?.[0]?.stats.winRate || 89}%</p>
                <p className="text-xs text-[#A0A0A0]">Win Rate</p>
              </div>
              <div className="bg-[#161616] rounded-xl py-3 px-2 text-center">
                <p className="text-[#9B7BFF] text-xl font-bold">{strategies?.[0]?.stats.riskRatio || '1:3'}</p>
                <p className="text-xs text-[#A0A0A0]">Avg R/R</p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="px-4 pb-5">
            <div className="bg-[#161616] rounded-xl p-4 text-center">
              <h3 className="text-lg font-semibold text-white mb-1">
                {links?.[0]?.title || 'Join my free telegram channel!'}
              </h3>
              <p className="text-sm text-[#A0A0A0] mb-3">
                {links?.[0]?.description || 'Get involved with other alphas and start scaling. This is your time right now.'}
              </p>
              <button className="bg-[#7048E8] hover:bg-[#6040D0] text-white py-2 px-6 rounded-full transition-colors text-sm font-medium">
                {links?.[0]?.cta.text || 'Check it out'}
              </button>
            </div>
          </div>
          
          {/* Footer with Tradr Logo */}
          <div className="px-4 py-3 flex justify-center">
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Powered by Tradr</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hub Button (Fixed Position) */}
      <div className="fixed left-6 bottom-6 z-50">
        <motion.button
          className="relative p-3.5 rounded-full bg-[#7B61FF] hover:bg-[#8B74FF] transition-colors shadow-[0_4px_20px_rgba(123,97,255,0.5)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <IoGridOutline className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
} 