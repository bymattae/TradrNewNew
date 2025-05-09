"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, ArrowLeft } from "lucide-react";
import { components } from "@/lib/styles/design-system";
import Image from "next/image";
import { DefaultAvatar } from "@/app/components/DefaultAvatar";
import { getProfile, updateProfile } from "@/lib/supabase/profile";
import { useAuth } from "@/lib/hooks/useAuth";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full h-full min-h-0 bg-gradient-radial from-[#320D66] via-[#1C1C24] to-[#15161B] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto rounded-2xl bg-[#181824] p-6 shadow-lg flex flex-col gap-6" style={{minHeight: 0}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
          <div className="w-8 h-8" />
        </div>
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
        <div className="flex items-center bg-[#232336] rounded-xl px-4 py-3">
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
        <div className="flex items-center bg-[#232336] rounded-xl px-4 py-3">
          <input
            type="text"
            value={form.bio}
            onChange={e => handleChange('bio', e.target.value)}
            className="bg-transparent outline-none text-white text-base flex-1"
            maxLength={120}
            placeholder="Say something bold."
          />
          <Edit className="w-4 h-4 text-white/40 ml-2" />
        </div>
        {/* Hashtags Input */}
        <div className="flex flex-wrap gap-2 bg-[#232336] rounded-xl px-4 py-3">
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
          className="w-full rounded-2xl bg-[#181824] py-8 text-lg font-medium text-white shadow-lg"
          onClick={() => router.push('/strategy')}
        >
          + Add strategy
        </button>
        {/* Display a Link Block */}
        <button
          type="button"
          className="w-full rounded-2xl bg-[#181824] py-8 text-lg font-medium text-white shadow-lg"
        >
          + Display a link
        </button>
        {/* Save Button */}
        <button
          type="button"
          className={components.button.primary + ' w-full py-4 text-lg mt-2'}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {error && <div className="text-red-400 text-xs text-center mt-2">{error}</div>}
      </div>
    </div>
  );
} 