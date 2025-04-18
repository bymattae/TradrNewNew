'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { toast } from 'sonner';
import ImageCropModal from '../components/ImageCropModal';

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
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const [session, setSession] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditingTag, setIsEditingTag] = useState(false);

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
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
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
  }, [supabase.auth, router]);

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
          setUsername(profile.username || '');
          setBio(profile.bio || '');
          setTags(profile.tags || []);
          setAvatarUrl(profile.avatar_url || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [session, supabase]);

  // Auto-save functionality
  useEffect(() => {
    if (!session?.user?.id || !session?.user?.email) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (username || bio || tags.length > 0 || avatarUrl) {
      setAutoSaveStatus('saving');
      autoSaveTimeoutRef.current = setTimeout(async () => {
        try {
          // Validate username if it exists
          if (username) {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(username)) {
              setAutoSaveStatus('error');
              return;
            }

            // Check if username is already taken
            const { data: existingUser } = await supabase
              .from('profiles')
              .select('id')
              .eq('username', username)
              .neq('id', session.user.id)
              .single();

            if (existingUser) {
              setAutoSaveStatus('error');
              return;
            }
          }

          const { error } = await supabase
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

          if (error) {
            console.error('Auto-save error:', error);
            setAutoSaveStatus('error');
            toast.error('Failed to save profile', {
              position: 'top-right',
              duration: 2000,
            });
            return;
          }

          setAutoSaveStatus('saved');
          setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
          console.error('Auto-save error:', error);
          setAutoSaveStatus('error');
          toast.error('Failed to save profile', {
            position: 'top-right',
            duration: 2000,
          });
        }
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [username, bio, tags, avatarUrl, session, supabase]);

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

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
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

  const handleSaveUsername = async () => {
    setUsername(tempUsername);
    setIsEditingUsername(false);
    await handleSave();
  };

  const handleEditBio = () => {
    setTempBio(bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    setBio(tempBio);
    setIsEditingBio(false);
    await handleSave();
  };

  const handleSave = async () => {
    if (!session?.user?.id || !session?.user?.email) {
      toast.error('Please sign in to save your profile');
      return;
    }

    try {
      setIsSaving(true);

      // Validate required fields
      if (!username) {
        toast.error('Username is required');
        return;
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        toast.error('Username can only contain letters, numbers, and underscores');
        return;
      }

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

      const { error } = await supabase
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

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Failed to save profile', {
          position: 'top-right',
          duration: 2000,
        });
        return;
      }

      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile', {
        position: 'top-right',
        duration: 2000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinish = async () => {
    await handleSave();
    router.push('/dashboard');
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
          <h1 className="text-xl font-bold">Build your profile</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            Done
          </button>
        </div>

        {/* Save status bar */}
        <div className="px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex items-center justify-center gap-2">
            {autoSaveStatus === 'saving' && (
              <div className="flex items-center gap-1.5">
                <div className="animate-spin rounded-full h-3 w-3 border border-zinc-500 border-t-white"></div>
                <span className="text-xs text-zinc-500">Saving changes...</span>
              </div>
            )}
            {autoSaveStatus === 'saved' && lastSaved && (
              <div className="flex items-center gap-1.5 text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Updated {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-hide max-w-2xl mx-auto w-full">
          {/* Profile Fields Section */}
          <div className="space-y-6">
            {/* Avatar upload */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-zinc-900/50 border-2 border-dashed border-zinc-800/50 overflow-hidden flex items-center justify-center hover:border-indigo-500/50 transition-all group backdrop-blur-xl"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      fill
                      className="object-cover rounded-full"
                    />
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Username input */}
            <div className="mb-8">
              <div className="relative flex items-center bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-4 hover:border-zinc-700/50 transition-all group">
                <span className="text-gray-400 text-lg">@</span>
                <div className="flex-1 ml-1">
                  <p onClick={handleEditUsername} className="text-lg text-white cursor-pointer">
                    {username || <span className="text-gray-500">yourusername</span>}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">
                    tradr.co/{username || 'yourusername'}
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
            </div>

            {/* Bio input */}
            <div className="mb-8">
              <div className="relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-4 hover:border-zinc-700/50 transition-all group">
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
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center">
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
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add hashtag
                </button>
              )}
            </div>

            {/* Add tag modal */}
            {isEditingTag && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-sm bg-zinc-900 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
                    <button 
                      onClick={() => setIsEditingTag(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        handleAddTag();
                        setIsEditingTag(false);
                      }}
                      disabled={!newTag}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800/50 backdrop-blur-xl">
                      <div className="flex items-center pl-4 text-gray-400">
                        <span className="text-lg">#</span>
                      </div>
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTag) {
                            handleAddTag();
                            setIsEditingTag(false);
                          }
                        }}
                        className="w-full bg-transparent py-3 px-2 text-base text-white focus:outline-none"
                        placeholder="Add a hashtag"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Fields Section */}
          <div className="space-y-6 mt-8">
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

        {/* Floating Continue button */}
        <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-zinc-800/50 bg-black/80 backdrop-blur-xl max-w-2xl mx-auto w-full">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

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
      `}</style>
    </div>
  );
} 