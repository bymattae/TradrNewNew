'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Edit, Link2, ExternalLink, MessageCircle, Copy } from 'lucide-react';
import { BsTwitterX, BsWhatsapp, BsTelegram, BsLink45Deg } from 'react-icons/bs';
import { FiShare } from 'react-icons/fi';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { TradrIcon } from '@/app/components/Icons';
import EditProfileModal from '@/app/components/EditProfileModal';

// Update type definition at the top
interface Profile {
  id?: string;  // Optional since we might not have it during creation
  username: string;
  bio: string;
  avatar_url: string | null;
  hashtags: string[];
  tags?: string[];  // For backward compatibility
  created_at?: string;
  updated_at?: string;
}

export default function Dashboard3Page() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const sharePopupRef = useRef<HTMLDivElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Close share popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sharePopupRef.current && !sharePopupRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/join');
          return;
        }

        setCurrentUser(user);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, bio, avatar_url, tags, hashtags')
          .eq('id', user.id)
          .single();

        const profile = {
          ...profileData,
          hashtags: profileData?.hashtags || profileData?.tags || [],
        };

        const isProfileEmpty = !profile || (
          !profile.username &&
          !profile.bio &&
          !profile.avatar_url &&
          (!profile.hashtags || profile.hashtags.length === 0)
        );

        if (isProfileEmpty) {
          toast.error('Please complete your profile first');
          router.push('/onboarding');
          return;
        }

        setProfile(profile as Profile);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/join');
      }
    };
    
    checkAuth();
  }, [router, supabase]);

  // Handle profile update
  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    try {
      await supabase
        .from('profiles')
        .update({
          username: updatedProfile.username,
          bio: updatedProfile.bio,
          avatar_url: updatedProfile.avatar_url,
          hashtags: updatedProfile.hashtags,
        })
        .eq('id', currentUser?.id);

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-radial from-[#320D66] via-[#1C1C24] to-[#15161B] overflow-hidden">
      <div className="w-full max-w-md mx-auto flex flex-col h-full pt-5">
        {/* Top Bar - Fixed Height */}
        <div className="px-4 py-2 flex items-center justify-between flex-shrink-0 h-14">
          {/* Left side - Share Icon */}
          <div className="relative">
            <motion.button 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-2.5 rounded-full bg-[#1A1B1F]/80 backdrop-blur-sm border border-[#2A2B30] hover:bg-[#2A2B30] active:scale-95 transition-all duration-200"
              onClick={() => setIsShareOpen(!isShareOpen)}
            >
              <FiShare className="w-5 h-5 text-white/90" />
            </motion.button>
            
            {/* Share Popup */}
            <AnimatePresence>
              {isShareOpen && (
                <motion.div
                  ref={sharePopupRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-[#1C1C24]/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-50 overflow-hidden"
                >
                  <div className="p-2">
                    <div className="text-white/80 text-xs font-medium px-3 py-2 border-b border-white/5">
                      Share your profile
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      <button 
                        className="flex items-center space-x-3 w-full p-3 text-left text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => {
                          window.open(`https://twitter.com/intent/tweet?text=Check out my trading profile on tradr.co/${profile?.username || 'username'}`, '_blank');
                          setIsShareOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#000000] text-white">
                          <BsTwitterX className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium">Share on X</span>
                      </button>
                      
                      <button 
                        className="flex items-center space-x-3 w-full p-3 text-left text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => {
                          window.open(`https://wa.me/?text=Check out my trading profile on tradr.co/${profile?.username || 'username'}`, '_blank');
                          setIsShareOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366] text-white">
                          <BsWhatsapp className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Share via WhatsApp</span>
                      </button>
                      
                      <button 
                        className="flex items-center space-x-3 w-full p-3 text-left text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => {
                          window.open(`https://t.me/share/url?url=tradr.co/${profile?.username || 'username'}&text=Check out my trading profile!`, '_blank');
                          setIsShareOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0088cc] text-white">
                          <BsTelegram className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Share on Telegram</span>
                      </button>
                      
                      <button 
                        className="flex items-center space-x-3 w-full p-3 text-left text-white/80 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(`tradr.co/${profile?.username || 'username'}`);
                          toast.success('Link copied to clipboard!');
                          setIsShareOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          <BsLink45Deg className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Copy link</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center - URL */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#1A1B1F]/80 rounded-full border border-[#2A2B30] backdrop-blur-sm"
          >
            <div className="relative w-5 h-5 mr-1 rounded-full overflow-hidden bg-blue-500">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/TradrIcon%20(1).png`}
                alt="Tradr"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white/90 text-sm font-medium">tradr.co/{profile?.username || 'username'}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`tradr.co/${profile?.username || 'username'}`);
                toast.success('Copied to clipboard!');
              }}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-white/70" />
            </button>
          </motion.div>

          {/* Right side - Edit button */}
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-2.5 rounded-full bg-[#1A1B1F]/80 backdrop-blur-sm border border-[#2A2B30] hover:bg-[#2A2B30] active:scale-95 transition-all duration-200"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="w-5 h-5 text-white/90" />
          </motion.button>
        </div>

        {/* Main Content Area with Padding Top and Bottom */}
        <div className="flex-1 flex flex-col px-4 pt-2.5 pb-20 overflow-hidden">
          {/* Profile Preview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full h-[calc(100%-1.5rem)] rounded-3xl bg-[#1C1C24]/80 backdrop-blur-xl border border-white/5 shadow-[0_0_25px_rgba(168,85,247,0.1)] flex flex-col overflow-hidden z-20"
          >
            {/* Scrollable Content */}
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
                    className="text-center"
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
                    {(profile?.hashtags || ['#Coolman']).map((tag: string, index: number) => (
                      <span 
                        key={index} 
                        className={`px-3 py-1 rounded-full text-xs ${
                          isHovered
                            ? 'bg-white/10 text-white/90'
                            : 'bg-[#333]/50 text-white/70'
                        }`}
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
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleProfileUpdate}
      />
    </div>
  );
} 