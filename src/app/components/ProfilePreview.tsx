'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfilePreviewProps {
  username: string;
  avatarUrl?: string;
  bio?: string;
  tags?: string[];
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

export default function ProfilePreview({
  username,
  avatarUrl,
  bio,
  tags,
  strategies,
  links
}: ProfilePreviewProps) {
  return (
    <div className="w-full max-w-md mx-auto overflow-hidden">
      {/* Profile Header Section */}
      <div className="bg-[#0A0A0C] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 to-violet-600 p-[1px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    width={64}
                    height={64}
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                    {username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1 bg-violet-500 rounded-full p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Username and Bio */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">@{username}</h2>
            {bio && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{bio}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-medium text-violet-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Strategies Section */}
      {strategies && strategies.length > 0 && (
        <div className="mt-4 bg-[#0A0A0C] rounded-2xl border border-white/10 divide-y divide-white/10">
          {strategies.map((strategy, index) => (
            <div key={index} className="p-4">
              <h3 className="font-medium text-white">{strategy.title}</h3>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-400">Gain</p>
                  <p className="text-sm font-medium text-green-400">+{strategy.stats.gain}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Win Rate</p>
                  <p className="text-sm font-medium text-white">{strategy.stats.winRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Risk Ratio</p>
                  <p className="text-sm font-medium text-white">{strategy.stats.riskRatio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Links Section */}
      {links && links.length > 0 && (
        <div className="mt-4 space-y-4">
          {links.map((link, index) => (
            <div key={index} className="bg-[#0A0A0C] rounded-2xl border border-white/10 p-4">
              <h3 className="font-medium text-white">{link.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{link.description}</p>
              <a
                href={link.cta.url}
                className="inline-block w-full mt-3 px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-xl text-sm font-medium text-white text-center transition-colors"
              >
                {link.cta.text}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Powered by Tradr */}
      <div className="mt-4 flex items-center justify-center gap-2 py-3 bg-[#0A0A0C] rounded-2xl border border-white/10">
        <div className="w-4 h-4 bg-violet-500 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-white">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12.75l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xs font-medium text-gray-500">Powered by Tradr</span>
      </div>
    </div>
  );
} 