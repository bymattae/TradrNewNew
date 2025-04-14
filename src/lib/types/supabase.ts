import { Database } from '@/lib/types/supabase-generated'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface Tag {
  id: string
  name: string
}

export interface ProfileWithTags extends Profile {
  tags: Tag[]
} 