import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export async function getProfile(userId: string) {
  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (error) throw error;
  
  // Ensure we always return hashtags, even if they were stored as tags
  return {
    ...data,
    hashtags: data.hashtags || [],
  };
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = createClientComponentClient<Database>();
  
  // Ensure we're using hashtags consistently
  const normalizedUpdates = {
    ...updates,
    hashtags: updates.hashtags || [],
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(normalizedUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(profile: Profile) {
  const supabase = createClientComponentClient<Database>();
  
  // Ensure we're using hashtags consistently
  const normalizedProfile = {
    ...profile,
    hashtags: profile.hashtags || [],
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert([normalizedProfile])
    .select()
    .single();

  if (error) throw error;
  return data;
} 