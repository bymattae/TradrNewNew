import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  username: string;
  bio: string;
  avatar_url?: string | null;
  hashtags: string[];
}

export default function ProfileCard({ username, bio, avatar_url, hashtags }: ProfileCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full h-[calc(100%-1.5rem)] rounded-3xl bg-[#1C1C24]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_25px_rgba(168,85,247,0.1)] flex flex-col overflow-hidden z-20"
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        <div className="px-6 py-5 space-y-4 pb-0 flex flex-col h-full">
          <div className="flex-1 space-y-4">
            {/* Avatar and Username Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-2.5"
            >
              <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-purple-500/30 ring-offset-4 ring-offset-[#1C1C24] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Image
                  src={avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-white font-bold text-2xl tracking-tight">
                {username}
              </h2>
            </motion.div>
            {/* Bio Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-white/80 text-sm leading-relaxed">
                {bio}
              </p>
            </motion.div>
            {/* Tags Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {(hashtags || ['#Coolman']).map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-xs bg-[#333]/50 text-white/70`}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-black/20 rounded-2xl p-4 max-w-sm mx-auto w-full border border-white/5 shadow-[0_0_25px_rgba(168,85,247,0.1)] backdrop-blur-sm"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-white font-semibold text-xl tracking-tight">12.5%</p>
                  <p className="text-gray-400 text-sm mt-1">Gain</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-xl tracking-tight">89%</p>
                  <p className="text-gray-400 text-sm mt-1">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-xl tracking-tight">1:3</p>
                  <p className="text-gray-400 text-sm mt-1">Risk Ratio</p>
                </div>
              </div>
            </motion.div>
            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-4 max-w-sm mx-auto w-full border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🔥</span>
                  <h3 className="text-white font-bold text-xl tracking-tight">Join our alpha community</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed text-center">
                  Connect with 500+ traders, share insights, and grow together.
                </p>
                <button className="w-full bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white py-3 rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  Join Community
                </button>
              </div>
            </motion.div>
          </div>
          {/* Premium Footer at the bottom of the card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-auto pt-8 pb-5 select-none w-full"
          >
            <div className="border-t border-white/5 mb-4 w-full" />
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-white/60">Powered by</span>
                <div className='relative w-5 h-5'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/TradrIcon%20(1).png`}
                    alt="Tradr"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-white/70">Tradr</span>
              </div>
              <a
                href="/onboarding"
                className="mt-1 text-[11px] text-purple-300/80 hover:text-purple-400 transition-colors flex items-center gap-1 font-medium cursor-pointer"
                style={{ letterSpacing: '0.01em' }}
              >
                Make yours <span className="text-base">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 