'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Settings, Share2, Link, Grid, Twitter, Send } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Dashboard3Page() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/join');
          return;
        }

        setCurrentUser(user);

        const { data: profile } = await supabase
          .from('profiles')
          .select('username, bio, avatar_url, tags')
          .eq('id', user.id)
          .single();

        const isProfileEmpty = !profile || (
          !profile.username &&
          !profile.bio &&
          !profile.avatar_url &&
          (!profile.tags || profile.tags.length === 0)
        );

        if (isProfileEmpty) {
          toast.error('Please complete your profile first');
          router.push('/onboarding');
          return;
        }

        setProfile(profile);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/join');
      }
    };
    
    checkAuth();
  }, [router, supabase]);

  return (
    <div className="h-screen w-full max-w-md mx-auto flex flex-col bg-gradient-radial from-[#320D66] via-[#1C1C24] to-[#15161B] overflow-hidden">
      {/* Top Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <button 
          className="p-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 active:scale-95 transition-all duration-200"
          onClick={() => router.push('/hub')}
        >
          <Grid className="w-5 h-5 text-white/90" />
        </button>
        <button 
          className="p-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/15 active:scale-95 transition-all duration-200"
        >
          <Settings className="w-5 h-5 text-white/90" />
        </button>
      </motion.div>

      {/* Main Container */}
      <div className="flex-1 px-4 flex flex-col space-y-3">
        {/* "Try Pro" Button */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-end"
        >
          <button className="px-5 py-2 rounded-full bg-[#1C1C24]/80 text-purple-300 text-sm font-medium border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-purple-500/10 active:scale-95 transition-all duration-200">
            Try Pro for free
          </button>
        </motion.div>

        {/* Profile Preview Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-[75vh] flex flex-col rounded-3xl overflow-hidden bg-[#1C1C24]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_25px_rgba(168,85,247,0.1)]"
        >
          {/* URL Bar */}
          <div className="w-full bg-black/20 px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center space-x-3">
              <Link className="w-4 h-4 text-purple-400" />
              <span className="text-white/90 text-sm font-medium">tradr.io/{profile?.username || 'username'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-200">
                <BsWhatsapp className="w-3.5 h-3.5 text-purple-400" />
              </button>
              <button className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-200">
                <Send className="w-3.5 h-3.5 text-purple-400" />
              </button>
              <button className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-200">
                <Twitter className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Profile Content - Static */}
          <div className="flex-1">
            <div className="px-6 py-6 space-y-5">
              {/* Avatar and Username Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-4"
              >
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden ring-2 ring-purple-500/30 ring-offset-4 ring-offset-[#1C1C24] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Image
                    src={profile?.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-white font-bold text-2xl tracking-tight">
                  {profile?.username || currentUser?.email?.split('@')[0] || 'cryptowhale'}
                </h2>
              </motion.div>

              {/* Bio Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center max-w-sm mx-auto"
              >
                <p className="text-white/80 text-sm leading-relaxed">
                  {profile?.bio || 'I\'m a trader from germany'}
                </p>
              </motion.div>

              {/* Tags Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-2"
              >
                {(profile?.tags || ['#Coolman']).map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-4 py-1.5 bg-purple-500/10 text-purple-300 text-sm rounded-full font-medium border border-purple-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>

              {/* Stats Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/20 rounded-2xl p-6 max-w-sm mx-auto w-full border border-white/5 shadow-[0_0_25px_rgba(168,85,247,0.1)]"
              >
                <div className="grid grid-cols-3 gap-6">
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
                className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 max-w-sm mx-auto w-full border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">🔥</span>
                    <h3 className="text-white font-bold text-xl tracking-tight">Join our alpha community</h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed text-center">
                    Connect with 500+ traders, share insights, and grow together.
                  </p>
                  <button className="w-full bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white py-4 rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    Join Community
                  </button>
                </div>
              </motion.div>

              {/* Powered by Tradr */}
              <div className="flex items-center justify-center space-x-2 mt-auto">
                <div className="relative w-4 h-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/TradrIcon%20(1).png`}
                    alt="Tradr"
                    fill
                    className="object-contain opacity-80"
                  />
                </div>
                <div className="text-white/50 text-sm font-medium tracking-wide backdrop-blur-sm">
                  Powered by <span className="text-white/70">Tradr</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 