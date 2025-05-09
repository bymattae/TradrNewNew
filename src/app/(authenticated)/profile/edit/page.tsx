"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, ArrowLeft, Settings } from "lucide-react";
import { components } from "@/lib/styles/design-system";
import Image from "next/image";
import { DefaultAvatar } from "@/app/components/DefaultAvatar";
import { getProfile, updateProfile } from "@/lib/supabase/profile";
import { useAuth } from "@/lib/hooks/useAuth";
import { FiShare } from 'react-icons/fi';
import ProfileCard from '@/app/components/ProfileCard';

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (!user) return;
    getProfile(user.id).then((data: any) => {
      setProfile(data);
      setForm({
        username: data?.username || "",
        bio: data?.bio || "",
        hashtags: data?.hashtags || [],
        avatar_url: data?.avatar_url || null,
      });
      setAvatarPreview(data?.avatar_url || null);
    });
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
        handleChange("avatar_url", ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHashtagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      const tag = e.currentTarget.value.trim();
      if (!form.hashtags.includes(tag)) {
        handleChange("hashtags", [...form.hashtags, tag]);
      }
      e.currentTarget.value = "";
    }
  };
  const handleRemoveHashtag = (tag: string) => {
    handleChange("hashtags", form.hashtags.filter((t: string) => t !== tag));
  };

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
      });
      setSaving(false);
      router.push("/dashboard");
    } catch (e) {
      setError("Failed to save profile");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-radial from-[#320D66] via-[#1C1C24] to-[#15161B] overflow-hidden">
      <div className="w-full max-w-md mx-auto flex flex-col h-full pt-5">
        {/* Header - match dashboard style, tabs in header, settings button right */}
        <div className="px-4 py-2 flex items-center justify-between flex-shrink-0 h-14">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2.5 rounded-full bg-[#1A1B1F]/80 backdrop-blur-sm border border-[#2A2B30] hover:bg-[#2A2B30] active:scale-95 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-white/90" />
          </button>
          {/* Tabs in header as pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors focus:outline-none ${
                activeTab === 'edit'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow'
                  : 'bg-[#232336] text-white/70 hover:bg-[#28284a]'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors focus:outline-none ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow'
                  : 'bg-[#232336] text-white/70 hover:bg-[#28284a]'
              }`}
            >
              Preview
            </button>
          </div>
          <button
            className="p-2.5 rounded-full bg-[#1A1B1F]/80 backdrop-blur-sm border border-[#2A2B30] hover:bg-[#2A2B30] active:scale-95 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-white/90" />
          </button>
        </div>
        {/* Main Content - scrollable, no outer card */}
        <div className="flex-1 flex flex-col px-4 pt-2.5 pb-24 overflow-y-auto gap-4">
          {activeTab === 'edit' ? (
            <>
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center gap-2 border border-[#2A2B30] rounded-2xl p-4 bg-[#181824] shadow-[0_0_25px_rgba(168,85,247,0.1)]">
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
                    <DefaultAvatar className="rounded-full border-2 border-[#7048E8] shadow-md w-20 h-20" />
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
              <div className="flex items-center border border-[#2A2B30] rounded-2xl px-4 py-3 bg-[#181824] shadow-[0_0_25px_rgba(168,85,247,0.1)]">
                <span className="text-white/60 mr-2">@</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => handleChange('username', e.target.value)}
                  className="bg-transparent outline-none text-white text-base font-medium flex-1"
                  maxLength={24}
                  placeholder="yourname"
                  required
                />
                <span className="text-white/40 ml-2 text-sm">tradr.co/@yourname</span>
              </div>
              {/* Bio Input */}
              <div className="flex items-center border border-[#2A2B30] rounded-2xl px-4 py-3 bg-[#181824] shadow-[0_0_25px_rgba(168,85,247,0.1)]">
                <textarea
                  value={form.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  className="bg-transparent outline-none text-white text-base flex-1 resize-none min-h-[80px]"
                  maxLength={240}
                  placeholder="Say something bold."
                  rows={3}
                />
                <Edit className="w-4 h-4 text-white/40 ml-2" />
              </div>
              {/* Hashtags Input */}
              <div className="flex flex-wrap gap-2 border border-[#2A2B30] rounded-2xl px-4 py-3 bg-[#181824] shadow-[0_0_25px_rgba(168,85,247,0.1)]">
                {(form.hashtags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-700/40 to-purple-700/40 text-white flex items-center gap-1"
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
                  className="bg-[#232336] outline-none text-white/80 text-sm px-2 py-1 rounded-full min-w-[60px]"
                  placeholder="+ Add tag"
                  onKeyDown={handleHashtagInput}
                />
              </div>
              {/* Add Strategy Block */}
              <button
                type="button"
                className="w-full rounded-2xl bg-[#181824] py-4 text-lg font-medium text-white shadow-lg border border-[#2A2B30]"
                onClick={() => router.push('/strategy')}
              >
                + Add strategy
              </button>
              {/* Display a Link Block */}
              <button
                type="button"
                className="w-full rounded-2xl bg-[#181824] py-4 text-lg font-medium text-white shadow-lg border border-[#2A2B30]"
              >
                + Display a link
              </button>
            </>
          ) : (
            <ProfileCard
              username={form.username || ''}
              bio={form.bio || ''}
              avatar_url={form.avatar_url || undefined}
              hashtags={form.hashtags || []}
            />
          )}
        </div>
        {/* Save Button - always visible at bottom */}
        <div className="w-full px-4 pb-4 pt-2 bg-gradient-to-t from-[#181824] via-[#181824]/80 to-transparent">
          <button
            type="button"
            className={components.button.primary + ' w-full py-4 text-lg'}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {error && <div className="text-red-400 text-xs text-center mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
} 