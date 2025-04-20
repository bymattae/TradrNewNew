'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import Image from 'next/image';
import { toast } from 'sonner';
import ImageCropModal from '../components/ImageCropModal';
import ProfilePreview from '../components/ProfilePreview';
import { Dialog } from '@headlessui/react';
import { ProfilePreviewDialog } from '../components/ProfilePreviewDialog';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Reasonable size for profile picture
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.8 // High quality compression
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

interface SocialLink {
  platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'telegram';
  url: string;
}

const SocialIcons = {
  twitter: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  telegram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
};

interface ProfilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLink[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [tempBio, setTempBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [errors, setErrors] = useState<{
    username?: boolean;
    bio?: boolean;
    tags?: boolean;
    avatar?: boolean;
  }>({});
  const [showValidation, setShowValidation] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState<SocialLink['platform']>('twitter');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Initialize and maintain session
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          
          if (!initialSession) {
            router.push('/auth/join');
            return;
          }

          // Check if user has already completed onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, bio, avatar_url, tags')
            .eq('id', initialSession.user.id)
            .single();

          // Check if profile exists and has any data
          const isProfileEmpty = !profile || (
            !profile.username &&
            !profile.bio &&
            !profile.avatar_url &&
            (!profile.tags || profile.tags.length === 0)
          );

          // Only stay on onboarding if profile is completely empty
          if (!isProfileEmpty) {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        router.push('/auth/join');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        if (!session) {
          router.push('/auth/join');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          return;
        }

        if (profile) {
          setUsername(profile.username as string || '');
          setBio(profile.bio as string || '');
          setTags((profile.tags as string[]) || []);
          setAvatarUrl(profile.avatar_url as string || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [session, supabase]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size too large. Maximum size is 5MB');
        return;
      }

      // Create a temporary URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowCropModal(true);
    } catch (error) {
      console.error('Error handling file selection:', error);
      toast.error('Error selecting file');
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    try {
      setUploading(true);
      setShowCropModal(false);

      if (!session?.user?.id) {
        throw new Error('No user session found');
      }

      // Convert base64 to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      // Create file path with user ID as the folder name
      const fileName = `${session.user.id}/avatar-${Date.now()}.jpg`;
      
      console.log('Uploading avatar to:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Force a re-render by appending a timestamp to the URL
      const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;
      console.log('Final avatar URL:', urlWithTimestamp);
      
      setAvatarUrl(urlWithTimestamp);
      toast.success('Avatar updated successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error?.message || 'Error uploading avatar');
    } finally {
      setUploading(false);
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
        setSelectedImage(null);
      }
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag) && tags.length < 3) {
      const tagToAdd = newTag.startsWith('#') ? newTag : `#${newTag}`;
      setTags([...tags, tagToAdd]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleEditUsername = () => {
    setTempUsername(username);
    setIsEditingUsername(true);
  };

  const handleSaveUsername = () => {
    setUsername(tempUsername);
    setIsEditingUsername(false);
  };

  const handleEditBio = () => {
    setTempBio(bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = () => {
    setBio(tempBio);
    setIsEditingBio(false);
  };

  const validateFields = () => {
    const newErrors = {
      username: !username,
      bio: !bio,
      tags: !tags.length,
      avatar: !avatarUrl
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleFinish = async () => {
    setShowValidation(true);
    if (!validateFields()) {
      toast.error('All required fields must be filled');
      return;
    }
    
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      toast.error('Username can only contain letters, numbers, and underscores');
      return;
    }

    if (!session?.user?.id || !session?.user?.email) {
      toast.error('Please sign in to save your profile');
      return;
    }

    try {
      setIsSaving(true);

      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', session.user.id)
        .single();

      if (existingUser) {
        toast.error('Username is already taken');
        return;
      }

      // Save all profile data
      const { error: saveError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          username,
          bio,
          tags,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (saveError) {
        console.error('Error saving profile:', saveError);
        toast.error('Failed to save profile');
        return;
      }

      toast.success('Profile saved successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSocialLink = () => {
    if (newSocialUrl && !socialLinks.some(link => link.platform === newSocialPlatform)) {
      setSocialLinks([...socialLinks, { platform: newSocialPlatform, url: newSocialUrl }]);
      setNewSocialUrl('');
      setNewSocialPlatform('twitter');
    }
  };

  const handleRemoveSocialLink = (platform: string) => {
    setSocialLinks(socialLinks.filter(link => link.platform !== platform));
  };

  if (isLoading) {
    return (
      <div className="h-[100dvh] bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-[100dvh] bg-black text-white flex flex-col">
      {/* Bio edit modal */}
      {isEditingBio && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col h-[100dvh]">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
            <button 
              onClick={() => setIsEditingBio(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <button
              onClick={handleSaveBio}
              disabled={isSaving}
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

          <div className="flex-1 px-4 py-6 flex flex-col">
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-bold">Your Tradr bio</h1>
              <p className="text-gray-500">Make it short. Make it sharp.</p>
            </div>

            <div className="flex-1">
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="Example: London scalper based in Germany.."
                maxLength={120}
                className="w-full h-48 bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl resize-none"
              />
              <div className="mt-2 flex justify-between items-center text-sm">
                <p className="text-gray-500">Keep it under 120 characters</p>
                <p className="text-gray-500">{tempBio.length}/120</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Username edit modal */}
      {isEditingUsername && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col h-[100dvh]">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
            <button 
              onClick={() => setIsEditingUsername(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <button
              onClick={handleSaveUsername}
              disabled={isSaving}
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

          <div className="flex-1 px-4 py-6 flex flex-col">
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-bold">Choose your @handle</h1>
              <p className="text-gray-500">This is your public Tradr link.</p>
            </div>

            <div className="flex bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50 backdrop-blur-xl">
              <div className="flex items-center pl-4 text-gray-400">
                <span className="text-lg">@</span>
              </div>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="w-full bg-transparent py-3 px-2 text-base text-white focus:outline-none"
                placeholder="username"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">Your profile will be available at</p>
              <p className="text-white text-base mt-1">tradr.co/@{tempUsername || 'username'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add the ImageCropModal */}
      {showCropModal && selectedImage && (
        <ImageCropModal
          imageUrl={selectedImage}
          onClose={() => {
            setShowCropModal(false);
            if (selectedImage) {
              URL.revokeObjectURL(selectedImage);
              setSelectedImage(null);
            }
          }}
          onSave={handleCropComplete}
        />
      )}

      {/* Add the ProfilePreview */}
      {showPreview && (
        <ProfilePreview
          username={username}
          bio={bio}
          tags={tags}
          strategies={[
            {
              title: "Example Strategy",
              stats: {
                gain: 0,
                winRate: 0,
                riskRatio: "0:0"
              }
            }
          ]}
          avatarUrl={avatarUrl}
        />
      )}

      <div className="flex-1 flex flex-col max-h-[100dvh] overflow-hidden">
        <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 text-transparent bg-clip-text">Build your profile</h1>
            <p className="text-zinc-500 text-sm">Make it yours. Make it awesome.</p>
          </div>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-hide max-w-2xl mx-auto w-full">
          {/* Profile Fields Section */}
          <div className="space-y-6">
            {/* Avatar upload with Tradr Score */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24">
                {/* Tradr Score Badge */}
                <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-600 p-[2px] shadow-lg z-10 animate-pulse">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">Lv.5</span>
                  </div>
                </div>
                {/* Animated gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-full blur opacity-75 animate-border"></div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full h-full rounded-full bg-zinc-900/50 border-2 border-dashed ${showValidation && errors.avatar ? 'border-red-500/50' : 'border-zinc-800/50'} overflow-hidden flex items-center justify-center hover:border-indigo-500/50 transition-all group backdrop-blur-xl`}
                >
                  {avatarUrl ? (
                    <div className="absolute inset-0">
                      <Image
                        src={avatarUrl}
                        alt="Avatar"
                        fill
                        className="object-cover rounded-full"
                        sizes="96px"
                        priority
                        onError={(e) => {
                          console.error('Error loading avatar:', e);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          setAvatarUrl('');
                        }}
                      />
                    </div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                    </div>
                  )}
                </button>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-0 bottom-0 w-8 h-8 bg-indigo-500 rounded-tl-xl flex items-center justify-center hover:bg-indigo-400 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </div>
              </div>
              {showValidation && errors.avatar && (
                <p className="mt-2 text-xs text-red-500">Profile picture is required</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Username input */}
            <div className="space-y-3">
              <div className={`relative flex items-center bg-zinc-900/50 border ${showValidation && errors.username ? 'border-red-500/50' : 'border-zinc-800/50'} rounded-xl px-4 py-4 hover:border-zinc-700/50 transition-all group`}>
                <span className="text-gray-400 text-lg">@</span>
                <div className="flex-1 ml-1">
                  <p onClick={handleEditUsername} className="text-lg text-white cursor-pointer">
                    {username || <span className="text-gray-500">yourusername</span>}
                  </p>
                </div>
                <button
                  onClick={handleEditUsername}
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </button>
              </div>
              {showValidation && errors.username && (
                <p className="text-xs text-red-500">Username is required</p>
              )}

              {/* Personalized link box */}
              <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-xl px-4 py-3 group cursor-pointer backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-400">Your personalized link</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">tradr.co/{username || 'yourusername'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors">
                      <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                      <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio input */}
            <div className="mb-8">
              <div className={`relative bg-zinc-900/50 border ${showValidation && errors.bio ? 'border-red-500/50' : 'border-zinc-800/50'} rounded-xl px-4 py-4 hover:border-zinc-700/50 transition-all group`}>
                <div className="flex-1 pr-8">
                  <p onClick={handleEditBio} className="text-[15px] text-white cursor-pointer min-h-[4rem]">
                    {bio || <span className="text-gray-500">Tell us about your strategy…</span>}
                  </p>
                </div>
                <button
                  onClick={handleEditBio}
                  className="absolute right-4 top-6 text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </button>
              </div>
              {showValidation && errors.bio && (
                <p className="mt-2 text-xs text-red-500">Bio is required</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <div className={`flex flex-wrap gap-2 items-center p-4 bg-zinc-900/50 border ${showValidation && errors.tags ? 'border-red-500/50' : 'border-zinc-800/50'} rounded-xl`}>
                {tags.length === 0 ? (
                  <button
                    onClick={() => setIsEditingTag(true)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="text-sm">Add hashtag</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-indigo-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                ) : (
                  <>
                {tags.map((tag, index) => (
                  <div
                    key={index}
                        className="group relative bg-indigo-600/20 border border-indigo-500/30 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-xl flex items-center gap-1.5"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                          className="text-indigo-300/70 hover:text-indigo-300 transition-colors"
                    >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                    </button>
                  </div>
                ))}
                {tags.length < 3 && (
                      <button
                        onClick={() => setIsEditingTag(true)}
                        className="flex items-center justify-center w-7 h-7 rounded-full border border-zinc-800/50 hover:border-indigo-500/50 transition-all text-gray-400 hover:text-indigo-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
                {isEditingTag && (
                  <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Type and press enter"
                      className="bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                      autoFocus
                      onBlur={() => {
                        if (newTag) {
                          handleAddTag();
                        }
                        setIsEditingTag(false);
                      }}
                    />
                  </div>
                )}
              </div>
              {showValidation && errors.tags && (
                <p className="text-xs text-red-500 w-full">At least one hashtag is required</p>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                {socialLinks.length === 0 ? (
                  <button
                    onClick={() => setIsEditingSocials(true)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <span className="text-sm">Add social links</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-indigo-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                ) : (
                  <>
                    {socialLinks.map((link) => (
                      <div
                        key={link.platform}
                        className="group relative bg-indigo-600/20 border border-indigo-500/30 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-xl flex items-center gap-1.5"
                      >
                        {SocialIcons[link.platform]}
                        <span>{link.platform}</span>
                        <button
                          onClick={() => handleRemoveSocialLink(link.platform)}
                          className="text-indigo-300/70 hover:text-indigo-300 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {socialLinks.length < 5 && (
                      <button
                        onClick={() => setIsEditingSocials(true)}
                        className="flex items-center justify-center w-7 h-7 rounded-full border border-zinc-800/50 hover:border-indigo-500/50 transition-all text-gray-400 hover:text-indigo-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Additional Fields Section */}
            <div className="space-y-6 mt-8 opacity-80">
              <p className="text-sm text-gray-500 mb-4">Optional</p>
            {/* Strategy */}
            <button 
              onClick={() => router.push('/strategy')}
                className="w-full border-2 border-dashed border-zinc-800/50 rounded-xl px-4 py-3 text-center hover:border-indigo-500/50 transition-all group backdrop-blur-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-gray-400 group-hover:text-indigo-400 transition-colors text-base">Add strategy</span>
              </div>
            </button>

            {/* Links */}
              <button className="w-full border-2 border-dashed border-zinc-800/50 rounded-xl px-4 py-3 text-center hover:border-indigo-500/50 transition-all group backdrop-blur-xl">
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-gray-400 group-hover:text-indigo-400 transition-colors text-base">Add links</span>
                </div>
              </button>
              </div>
          </div>
        </div>

        {/* Floating Continue button */}
        <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-zinc-800/50 bg-black/80 backdrop-blur-xl max-w-2xl mx-auto w-full">
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <span>Done</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Dialog */}
      <ProfilePreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        username={username}
        bio={bio}
        avatar={avatarUrl}
        socialLinks={socialLinks}
      />

      {/* Social Links Edit Modal */}
      {isEditingSocials && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col h-[100dvh]">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
            <button 
              onClick={() => setIsEditingSocials(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <button
              onClick={() => setIsEditingSocials(false)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
            >
              Done
            </button>
          </div>

          <div className="flex-1 px-4 py-6 flex flex-col">
            <div className="space-y-1 mb-6">
              <h1 className="text-2xl font-bold">Add social links</h1>
              <p className="text-gray-500">Connect your social media accounts</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value as SocialLink['platform'])}
                  className="flex-1 bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="telegram">Telegram</option>
                </select>
                <button
                  onClick={handleAddSocialLink}
                  disabled={!newSocialUrl || socialLinks.some(link => link.platform === newSocialPlatform)}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <input
                type="text"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder="Enter your profile URL"
                className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Your social links</h2>
              <div className="space-y-3">
                {socialLinks.map((link) => (
                  <div
                    key={link.platform}
                    className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-gray-400">
                        {SocialIcons[link.platform]}
                      </div>
                      <div>
                        <h3 className="text-white font-medium capitalize">{link.platform}</h3>
                        <p className="text-gray-400 text-sm">{link.url}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSocialLink(link.platform)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes checkmark {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes border {
          0%, 100% {
            transform: rotate(0deg);
            opacity: 0.75;
          }
          50% {
            transform: rotate(180deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
} 