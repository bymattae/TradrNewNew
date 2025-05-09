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
import ProfilePreview from '@/app/components/ProfilePreview';

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
          setProfile(profile as Profile);
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
            onClick={() => router.push('/profile/edit')}
          >
            <Edit className="w-5 h-5 text-white/90" />
          </motion.button>
        </div>

        {/* Main Content Area with Padding Top and Bottom */}
        <div className="flex-1 flex flex-col px-4 pt-2.5 pb-20 overflow-hidden">
          <ProfilePreview
            username={profile?.username || ''}
            bio={profile?.bio || ''}
            tags={profile?.hashtags || profile?.tags || []}
            avatarUrl={profile?.avatar_url || undefined}
            onEditClick={() => router.push('/profile/edit')}
            onShareClick={() => setIsShareOpen(true)}
            onThemeClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
} 