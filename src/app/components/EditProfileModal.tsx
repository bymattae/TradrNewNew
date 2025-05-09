'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Eye, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { DefaultAvatar } from './DefaultAvatar';
import { components } from '@/lib/styles/design-system';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSave: (updatedProfile: any) => Promise<void>;
}

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [form, setForm] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    hashtags: profile?.hashtags || [],
    avatar_url: profile?.avatar_url || null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setAvatarPreview(result);
        handleChange('avatar_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle hashtag input
  const handleHashtagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const tag = e.currentTarget.value.trim();
      if (!form.hashtags.includes(tag)) {
        handleChange('hashtags', [...form.hashtags, tag]);
      }
      e.currentTarget.value = '';
    }
  };

  // Handle hashtag removal
  const handleRemoveHashtag = (tag: string) => {
    handleChange('hashtags', form.hashtags.filter((t: string) => t !== tag));
  };

  // Handle save
  const handleSaveClick = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-[#181824] rounded-2xl shadow-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-500/30 text-white shadow underline underline-offset-8 decoration-purple-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-500/30 text-white shadow underline underline-offset-8 decoration-purple-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Preview
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'edit' ? (
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative group">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="rounded-full object-cover border-2 border-[#7048E8] shadow-md"
                        />
                      ) : (
                        <DefaultAvatar className="w-20 h-20 rounded-full border-2 border-[#7048E8] shadow-md" />
                      )}
                      <label className="absolute bottom-0 right-0 bg-[#7048E8] p-1.5 rounded-full cursor-pointer border-2 border-white/80 group-hover:scale-110 transition-transform">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                        <Edit className="w-4 h-4 text-white" />
                      </label>
                    </div>
                    <span className="text-xs text-gray-400">Tap to change</span>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Username</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={e => handleChange('username', e.target.value)}
                      className={components.input.base + " w-full"}
                      maxLength={24}
                      required
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Short Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={e => handleChange('bio', e.target.value)}
                      className={components.input.base + " w-full min-h-[60px]"}
                      maxLength={120}
                      placeholder="Share a bit about yourself..."
                    />
                  </div>

                  {/* Hashtags */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Hashtags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.hashtags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-[#333]/50 text-white/70 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-white/40 hover:text-red-400"
                            onClick={() => handleRemoveHashtag(tag)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        className="bg-transparent outline-none text-white/80 text-xs px-2 py-1 min-w-[60px]"
                        placeholder="#AddTag"
                        onKeyDown={handleHashtagInput}
                      />
                    </div>
                    <span className="text-xs text-gray-500">Press Enter to add a hashtag</span>
                  </div>

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    disabled={saving}
                    className={components.button.primary + " w-full mt-4 flex items-center justify-center gap-2"}
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>

                  {error && (
                    <div className="text-red-400 text-xs text-center mt-2">{error}</div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="mb-2 text-xs text-purple-300 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Previewing profile</span>
                  </div>
                  <div className="w-full rounded-2xl bg-[#181824] p-6 shadow-lg">
                    {/* Profile Preview Content */}
                    <div className="flex flex-col items-center gap-4">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="rounded-full object-cover border-2 border-[#7048E8] shadow-md"
                        />
                      ) : (
                        <DefaultAvatar className="w-20 h-20 rounded-full border-2 border-[#7048E8] shadow-md" />
                      )}
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-white">{form.username}</h2>
                        <p className="mt-2 text-gray-400">{form.bio}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {form.hashtags.map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-[#333]/50 text-white/70 px-3 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 