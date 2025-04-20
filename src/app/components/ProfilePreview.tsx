'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfilePreviewProps {
  username: string;
  avatarUrl?: string;
  bio?: string;
  tags: string[];
  stats: {
    gain: number;
    winRate: number;
    riskRatio: string;
  };
  strategies?: {
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
  stats,
  strategies
}: ProfilePreviewProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-zinc-900 to-black rounded-3xl overflow-hidden border border-white/10">
      {/* Profile Header */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/20 to-transparent opacity-50" />
        
        <div className="relative px-8 pt-8 pb-6 text-center">
          {/* Avatar */}
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-500 to-violet-400 p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                    {username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {/* Verified Badge */}
            <div className="absolute bottom-0 right-0 bg-violet-500 rounded-full p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Username */}
          <h2 className="mt-4 text-xl font-bold text-white">@{username}</h2>
          
          {/* Bio */}
          {bio && (
            <p className="mt-2 text-gray-400 text-sm">{bio}</p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/5 rounded-full text-sm font-medium text-violet-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1 px-4 py-6 bg-white/5">
        <motion.div 
          className="text-center p-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-2xl font-bold text-green-400">+{stats.gain}%</p>
          <p className="text-xs text-gray-400 mt-1">Gain</p>
        </motion.div>
        <motion.div 
          className="text-center p-3 border-x border-white/10"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
          <p className="text-xs text-gray-400 mt-1">Win Rate</p>
        </motion.div>
        <motion.div 
          className="text-center p-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-2xl font-bold text-white">{stats.riskRatio}</p>
          <p className="text-xs text-gray-400 mt-1">Risk Ratio</p>
        </motion.div>
      </div>

      {/* Strategies */}
      {strategies && strategies.length > 0 && (
        <div className="px-4 py-6 space-y-4">
          {strategies.map((strategy, index) => (
            <motion.div
              key={index}
              className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <h3 className="font-medium text-white">{strategy.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{strategy.description}</p>
              <a
                href={strategy.cta.url}
                className="inline-block mt-3 px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-xl text-sm font-medium text-white transition-colors"
              >
                {strategy.cta.text}
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {/* Powered by Tradr */}
      <div className="flex items-center justify-center gap-2 py-4 border-t border-white/10">
        <div className="w-5 h-5 bg-violet-500 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12.75l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xs font-medium text-gray-500">Powered by Tradr</span>
      </div>
    </div>
  );
} 