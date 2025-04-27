'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightLine } from 'react-icons/ri';
import { FiEdit3, FiShare2 } from 'react-icons/fi';
import { IoColorPaletteOutline } from 'react-icons/io5';
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
  return (
    <div className="w-full flex flex-col items-center">
      {/* Profile Preview Phone Frame */}
      <div className="w-full max-w-[320px] h-[580px] bg-[#151515] rounded-[32px] shadow-[0_0_35px_rgba(0,0,0,0.3),0_0_10px_rgba(123,97,255,0.1)] border-4 border-[#242424] overflow-hidden mb-6 relative">
        {/* Phone Screen Content - Scrollable */}
        <div className="w-full h-full overflow-y-auto bg-black px-3 py-3 scrollbar-hide">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#151515] rounded-2xl shadow-lg border border-[rgba(255,255,255,0.03)] overflow-hidden scale-[0.9]"
          >
            {/* Profile Header */}
            <div className="p-3">
              <div className="bg-[#181818] rounded-2xl p-4 shadow-sm flex flex-col items-center text-center space-y-1.5">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-purple)] to-[rgba(255,255,255,0.1)] p-[2px]">
                    <Image
                      src="/avatar.png"
                      alt="Profile"
                      width={56}
                      height={56}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold tracking-tight">{username}</h2>
                  <p className="text-xs font-normal text-[#A0A0A0]">Professional Trader</p>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {(tags || ['#crypto', '#defi', '#trading']).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded-full bg-[rgba(255,255,255,0.05)] text-[#A0A0A0]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="px-3 mb-3">
              <div className="bg-[#181818] rounded-2xl p-4 shadow-sm">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-base font-bold text-[var(--brand-purple)]">+47%</p>
                    <p className="text-[10px] font-normal text-[#A0A0A0]">Gain</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-[var(--brand-purple)]">89%</p>
                    <p className="text-[10px] font-normal text-[#A0A0A0]">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-[var(--brand-purple)]">2.5</p>
                    <p className="text-[10px] font-normal text-[#A0A0A0]">Risk Ratio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="px-3 mb-3">
              <div className="bg-[#181818] rounded-2xl p-4 shadow-sm text-center space-y-2">
                <h3 className="text-sm font-semibold">Premium Strategy Course</h3>
                <p className="text-xs font-normal text-[#A0A0A0]">Follow my trades in real-time</p>
                <button className="btn-primary w-4/5 mx-auto py-2 px-3 text-sm rounded-xl">
                  Get Access Now
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3">
              <p className="text-xs text-center font-normal text-[#A0A0A0]">
                powered by tradr
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Phone Home Indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-[#333] rounded-full"></div>
      </div>

      {/* Action Buttons Section - Static, outside phone frame */}
      <div className="w-full max-w-[320px]">
        <div className="flex justify-center gap-4">
          <button 
            onClick={onEditClick} 
            className="flex flex-col items-center justify-center bg-[#1A1A1A] w-[80px] h-[85px] rounded-xl shadow-sm border border-[rgba(255,255,255,0.03)]"
          >
            <FiEdit3 className="w-6 h-6 mb-1.5" />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button 
            onClick={onShareClick} 
            className="flex flex-col items-center justify-center bg-[#1A1A1A] w-[80px] h-[85px] rounded-xl shadow-sm border border-[rgba(255,255,255,0.03)]"
          >
            <FiShare2 className="w-6 h-6 mb-1.5" />
            <span className="text-sm font-medium">Share</span>
          </button>
          <button 
            onClick={onThemeClick} 
            className="flex flex-col items-center justify-center bg-[#1A1A1A] w-[80px] h-[85px] rounded-xl shadow-sm border border-[rgba(255,255,255,0.03)]"
          >
            <IoColorPaletteOutline className="w-6 h-6 mb-1.5" />
            <span className="text-sm font-medium">Theme</span>
          </button>
        </div>
      </div>
    </div>
  );
} 