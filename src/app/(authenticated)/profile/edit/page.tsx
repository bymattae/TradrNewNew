"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Edit, Eye, Settings, ArrowLeft, Loader2 } from "lucide-react";
import ProfilePreview from "@/app/components/ProfilePreview";
import CopyableUrl from "@/app/components/CopyableUrl";
import ImageCropModal from "@/app/components/ImageCropModal";
import { useAuth } from "@/lib/hooks/useAuth";
import { getProfile, updateProfile } from "@/lib/supabase/profile";
import { components } from "@/lib/styles/design-system";
import Image from "next/image";
import { DefaultAvatar } from "@/app/components/DefaultAvatar";

const DEFAULT_HASHTAGS = ["#NFTTrader", "#DeFiWhale", "#Web3"];
const THEME_OPTIONS = [
  { name: "Purple", value: "purple", color: "bg-gradient-to-br from-[#7048E8] to-[#9C48E8]" },
  { name: "Blue", value: "blue", color: "bg-gradient-to-br from-[#3047B8] to-[#7B9BFF]" },
  { name: "Green", value: "green", color: "bg-gradient-to-br from-[#0D9373] to-[#4DFFC7]" },
  { name: "Dark", value: "dark", color: "bg-[#181824]" },
];

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'settings'>('edit');
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [avatarToCrop, setAvatarToCrop] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data
  useEffect(() => {
    if (!user) return;
    getProfile(user.id)
      .then((data: any) => {
        setProfile(data);
        setForm({
          username: data.username || "",
          bio: data.bio || "",
          hashtags: data.hashtags || DEFAULT_HASHTAGS,
          avatar_url: data.avatar_url || null,
          community: data.community ?? true,
          theme: data.theme || "purple",
          isPrivate: data.is_private ?? false,
          requirePassword: data.require_password ?? false,
        });
        setAvatarPreview(data.avatar_url || null);
      })
      .catch(() => setError("Failed to load profile"));
  }, [user]);

  // Tab button styles
  const tabClass = (tab: 'edit' | 'preview') =>
    `px-4 py-2 text-sm font-semibold transition-colors rounded-xl ${
      activeTab === tab
        ? 'text-white bg-gradient-to-r from-purple-600/20 to-blue-500/20 shadow-md underline underline-offset-8 decoration-purple-400'
        : 'text-white/60 hover:text-white'
    }`;

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarToCrop(ev.target?.result as string);
        setAvatarModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save cropped avatar
  const handleAvatarSave = (cropped: string) => {
    setAvatarPreview(cropped);
    setForm((prev: any) => ({ ...prev, avatar_url: cropped }));
    setAvatarModal(false);
  };

  // Save profile
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile(user.id, {
        username: form.username,
        bio: form.bio,
        hashtags: form.hashtags,
        avatar_url: form.avatar_url,
        community: form.community,
        theme: form.theme,
        is_private: form.isPrivate,
        require_password: form.requirePassword,
      });
      setSaving(false);
    } catch (e) {
      setError("Failed to save profile");
      setSaving(false);
    }
  };

  // Hashtag input logic
  const handleHashtagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const tag = e.currentTarget.value.trim();
      if (!form.hashtags.includes(tag)) {
        handleChange('hashtags', [...form.hashtags, tag]);
      }
      e.currentTarget.value = '';
    }
  };
  const handleRemoveHashtag = (tag: string) => {
    handleChange('hashtags', form.hashtags.filter((t: string) => t !== tag));
  };

  // Community toggle
  const handleCommunityToggle = () => {
    handleChange('community', !form.community);
  };

  // Theme selector
  const handleThemeSelect = (theme: string) => {
    handleChange('theme', theme);
  };

  // Settings tab toggles
  const handlePrivateToggle = () => {
    handleChange('isPrivate', !form.isPrivate);
  };
  const handleRequirePasswordToggle = () => {
    handleChange('requirePassword', !form.requirePassword);
  };

  // Preview data
  const previewData = {
    username: form.username || profile?.username || '',
    bio: form.bio || profile?.bio || '',
    tags: form.hashtags || profile?.hashtags || DEFAULT_HASHTAGS,
    avatarUrl: avatarPreview || profile?.avatar_url || undefined,
    onEditClick: () => setActiveTab('edit'),
    onShareClick: () => {},
    onThemeClick: () => setActiveTab('edit'),
  };

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-[#320D66] via-[#1C1C24] to-[#15161B]">
        <Loader2 className="w-8 h-8 animate-spin text-white/80" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-[#320D66] via-[#1C1C24] to-[#15161B] flex flex-col items-center">
      {/* Top Nav */}
      <div className="w-full max-w-md flex items-center justify-between px-4 py-3 h-16 bg-black/80 border-b border-white/10 shadow-sm sticky top-0 z-20">
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button className={tabClass('edit')} onClick={() => setActiveTab('edit')}>
            Edit
          </button>
          <button className={tabClass('preview')} onClick={() => setActiveTab('preview')}>
            Preview
          </button>
        </div>
        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition-colors"
        >
          <Settings className="w-5 h-5 text-white/80" />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md flex-1 flex flex-col px-4 py-6">
        {activeTab === 'edit' && (
          <form
            className="space-y-6"
            onSubmit={e => { e.preventDefault(); handleSave(); }}
            autoComplete="off"
          >
            <div className="rounded-2xl bg-[#181824] p-6 shadow-lg flex flex-col gap-4">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Profile Avatar"
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-2 border-[#7048E8] shadow-md"
                    />
                  ) : (
                    <DefaultAvatar className="rounded-full border-2 border-[#7048E8] shadow-md" />
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
              {/* Username Input */}
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
              {/* Short Bio Input */}
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
              {/* Hashtags Input */}
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
              {/* Join Community Toggle */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-white">Join Community Block</label>
                <button
                  type="button"
                  onClick={handleCommunityToggle}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${form.community ? 'bg-green-500/60' : 'bg-gray-600/40'}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${form.community ? 'translate-x-4' : ''}`}
                  />
                </button>
                <span className="text-xs text-gray-400">Show community block on profile</span>
              </div>
              {/* Theme Selector */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Theme</label>
                <div className="flex gap-3 mt-1">
                  {THEME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${form.theme === opt.value ? 'border-[#7048E8] scale-110' : 'border-transparent'} ${opt.color} transition-transform`}
                      onClick={() => handleThemeSelect(opt.value)}
                    />
                  ))}
                </div>
              </div>
              {/* Save Button */}
              <button
                type="submit"
                className={components.button.primary + " w-full mt-2 flex items-center justify-center gap-2"}
                disabled={saving}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
              </button>
              {error && <div className="text-red-400 text-xs text-center mt-2">{error}</div>}
            </div>
          </form>
        )}
        {activeTab === 'preview' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="mb-2 text-xs text-purple-300 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>Previewing profile</span>
            </div>
            <ProfilePreview {...previewData} />
            <CopyableUrl username={form.username || profile?.username || ''} />
            {form.isPrivate && (
              <div className="mt-2 text-xs text-yellow-400 text-center">This profile is private. Only you can see it.</div>
            )}
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <div className="rounded-2xl bg-[#181824] p-6 shadow-lg w-full max-w-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Profile Visibility</span>
                <button
                  type="button"
                  onClick={handlePrivateToggle}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${form.isPrivate ? 'bg-red-500/60' : 'bg-gray-600/40'}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${form.isPrivate ? 'translate-x-4' : ''}`}
                  />
                </button>
                <span className="text-xs text-gray-400 ml-2">{form.isPrivate ? 'Private' : 'Public'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Require Password to View</span>
                <button
                  type="button"
                  onClick={handleRequirePasswordToggle}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${form.requirePassword ? 'bg-blue-500/60' : 'bg-gray-600/40'}`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${form.requirePassword ? 'translate-x-4' : ''}`}
                  />
                </button>
                <span className="text-xs text-gray-400 ml-2">{form.requirePassword ? 'Required' : 'Not Required'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Avatar Crop Modal */}
      {avatarModal && avatarToCrop && (
        <ImageCropModal
          imageUrl={avatarToCrop}
          onClose={() => setAvatarModal(false)}
          onSave={handleAvatarSave}
        />
      )}
    </div>
  );
} 