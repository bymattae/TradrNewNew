'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { toast } from 'sonner';

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
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) {
        toast.error('No file selected');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Authentication required');
        return;
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      if (!fileExt || !validExtensions.includes(fileExt)) {
        toast.error('Invalid file type. Please use JPG, PNG, or GIF');
        return;
      }

      // Create a unique filename
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false // Don't overwrite existing files
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        
        // Check if it's a bucket not found error
        if (uploadError.message?.includes('bucket not found')) {
          toast.error('Storage bucket not configured. Please contact support.');
          return;
        }
        
        // Check if it's a permissions error
        if (uploadError.message?.includes('permission denied')) {
          toast.error('Permission denied. Please try again or contact support.');
          return;
        }

        toast.error(uploadError.message || 'Failed to upload avatar');
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        toast.error('Failed to get avatar URL');
        return;
      }

      // Update the avatar URL in state
      setAvatarUrl(publicUrl);

      // Clean up old avatar if exists
      if (avatarUrl) {
        try {
          const oldPath = avatarUrl.split('/').pop(); // Get the old filename
          if (oldPath) {
            await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${oldPath}`]);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up old avatar:', cleanupError);
          // Don't return here, as the upload was successful
        }
      }

      toast.success('Avatar updated successfully');

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
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
                className="w-full h-32 bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-indigo-500/50 backdrop-blur-xl resize-none"
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
                <div className="animate-spin rounded-full h-2 w-2 border border-zinc-500 border-t-white"></div>
                <span className="text-xs text-zinc-500">Saving...</span>
              </div>
            )}
            {autoSaveStatus === 'saved' && lastSaved && (
              <span className="text-xs text-zinc-500">Last saved {lastSaved}</span>
            )}
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-hide max-w-2xl mx-auto w-full">
          {/* Required Fields Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-indigo-400">Required</span>
              <div className="h-px flex-1 bg-zinc-800/50"></div>
            </div>

            {/* Avatar upload */}
            <div className="flex flex-col items-center text-center">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-zinc-900/50 border-2 border-dashed border-zinc-800/50 overflow-hidden flex items-center justify-center hover:border-indigo-500/50 transition-all group backdrop-blur-xl mb-3"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <p className="text-sm text-gray-400">Add a profile photo</p>
            </div>

            {/* Username input */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Username</label>
                <button
                  onClick={handleEditUsername}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3">
                <div className="flex items-center text-gray-400">
                  <span className="text-base">@</span>
                  <span className="ml-1 text-white">{username || 'Choose your username'}</span>
                </div>
              </div>
            </div>

            {/* Bio input */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Bio</label>
                <button
                  onClick={handleEditBio}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-3">
                <p className="text-gray-400">
                  {bio || "What's your trading philosophy?"}
                </p>
              </div>
              <div className="bg-zinc-900/30 rounded-xl p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎯</span>
                  <span className="text-base text-white">Tips for a great bio</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                    Mention your trading style
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                    Add your experience level
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                    Keep it punchy
                  </li>
                </ul>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Tags</label>
                <span className="text-xs text-gray-500">{tags.length}/3</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="group relative bg-indigo-600/20 border border-indigo-500/30 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-xl"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="absolute -top-1.5 -right-1.5 hidden group-hover:flex bg-red-500 rounded-full w-4 h-4 items-center justify-center text-xs shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {tags.length < 3 && (
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="+ Add tag"
                    className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500/50 w-24 backdrop-blur-xl"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-400">Optional</span>
              <div className="h-px flex-1 bg-zinc-800/50"></div>
            </div>

            {/* Strategy */}
            <button 
              onClick={() => router.push('/strategy')}
              className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-6 text-left hover:border-indigo-500/50 transition-all group backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-white group-hover:text-indigo-400 transition-colors text-base font-medium">Add strategy</span>
                  <p className="text-sm text-gray-400">Share your trading approach and methodology</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
            </button>

            {/* Links */}
            <button className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-6 text-left hover:border-indigo-500/50 transition-all group backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-white group-hover:text-indigo-400 transition-colors text-base font-medium">Add links</span>
                  <p className="text-sm text-gray-400">Connect your social profiles and trading resources</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
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