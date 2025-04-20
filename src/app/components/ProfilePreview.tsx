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
    <div className="w-full max-w-md mx-auto bg-[#0A0A0C] rounded-3xl overflow-hidden border border-white/10">
      {/* Profile Header with Gradient Overlay */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
        
        <div className="relative px-8 pt-8 pb-6">
          {/* Avatar with Animated Border */}
          <motion.div 
            className="relative mx-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-violet-500 via-violet-400 to-violet-500 p-[2px] rotate-180 animate-[spin_4s_linear_infinite]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black rotate-180">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    width={112}
                    height={112}
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-violet-500 to-violet-600">
                    {username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            {/* Verified Badge with Animation */}
            <motion.div 
              className="absolute -bottom-1 -right-1 bg-violet-500 rounded-full p-2 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Username and Bio */}
          <motion.div 
            className="text-center mt-6 space-y-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white">@{username}</h2>
            {bio && (
              <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">{bio}</p>
            )}
          </motion.div>

          {/* Tags with Hover Effect */}
          <motion.div 
            className="flex flex-wrap gap-2 justify-center mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                className="px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm font-medium text-violet-400 hover:bg-violet-500/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                #{tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats with Animations */}
      <div className="grid grid-cols-3 gap-px bg-white/5 mt-6">
        <motion.div 
          className="text-center p-4 relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-2xl font-bold text-green-400">+{stats.gain}%</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Gain</p>
        </motion.div>
        <motion.div 
          className="text-center p-4 relative group border-x border-white/10"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Win Rate</p>
        </motion.div>
        <motion.div 
          className="text-center p-4 relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-2xl font-bold text-white">{stats.riskRatio}</p>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Risk Ratio</p>
        </motion.div>
      </div>

      {/* Strategies with Hover Effects */}
      {strategies && strategies.length > 0 && (
        <div className="px-4 py-6 space-y-4">
          {strategies.map((strategy, index) => (
            <motion.div
              key={index}
              className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all relative group overflow-hidden"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h3 className="font-medium text-white">{strategy.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{strategy.description}</p>
                <motion.a
                  href={strategy.cta.url}
                  className="inline-block mt-3 px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-xl text-sm font-medium text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {strategy.cta.text}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Powered by Tradr with Animation */}
      <motion.div 
        className="flex items-center justify-center gap-2 py-4 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-5 h-5 bg-violet-500 rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12.75l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-xs font-medium text-gray-500">Powered by Tradr</span>
      </motion.div>
    </div>
  );
} 