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
  return data;
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(profile: Profile) {
  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  if (error) throw error;
  return data;
} 