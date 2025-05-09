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
          className="fixed inset-0 bg-[#13131a] z-50 flex flex-col h-full w-full overflow-y-auto"
          onClick={onClose}
        >
          {/* Top bar with back/close button and tabs */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181824]">
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
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
            <div className="w-10" /> {/* Spacer for symmetry */}
          </div>

          {/* Content area, scrollable if needed */}
          <div className="flex-1 flex flex-col items-center justify-center w-full py-8 px-2 md:px-0 overflow-y-auto">
            <div className="w-full max-w-md flex flex-col gap-5">
              {/* Profile Section */}
              <div className="bg-[#232336] rounded-2xl p-6 flex flex-col items-center gap-2 shadow-md">
                <div className="relative group mb-2">
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
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center gap-2 w-full justify-center">
                    <span className="text-white text-base font-semibold">@</span>
                    <input
                      type="text"
                      value={form.username}
                      onChange={e => handleChange('username', e.target.value)}
                      className="bg-transparent text-white text-base font-semibold outline-none w-1/2 text-center"
                      maxLength={24}
                      required
                    />
                    <button className="ml-2 p-1 rounded hover:bg-[#28284a] transition-colors">
                      <Edit className="w-4 h-4 text-[#7048E8]" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">tradr.co/@{form.username || 'yourname'}</span>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-[#232336] rounded-2xl p-6 flex flex-col gap-2 shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-sm font-medium">Say something bold.</span>
                  <button className="ml-1 p-1 rounded hover:bg-[#28284a] transition-colors">
                    <Edit className="w-4 h-4 text-[#7048E8]" />
                  </button>
                </div>
                <textarea
                  value={form.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-full min-h-[40px] resize-none"
                  maxLength={120}
                  placeholder="Say something bold."
                />
              </div>

              {/* Hashtags Section */}
              <div className="bg-[#232336] rounded-2xl p-6 flex flex-col gap-2 shadow-md">
                <span className="text-white text-sm font-medium mb-1">Hashtags</span>
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

              {/* Add Strategy Section */}
              <button
                type="button"
                className="w-full py-6 rounded-2xl bg-[#232336] text-white text-lg font-medium shadow-md border border-white/10 hover:bg-[#28284a] transition-colors"
              >
                + Add strategy
              </button>

              {/* Display a Link Section */}
              <button
                type="button"
                className="w-full py-6 rounded-2xl bg-[#232336] text-white text-lg font-medium shadow-md border border-white/10 hover:bg-[#28284a] transition-colors"
              >
                + Display a link
              </button>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={saving}
                className="w-full py-5 rounded-2xl mt-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-lg font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
              {error && (
                <div className="text-red-400 text-xs text-center mt-2">{error}</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 