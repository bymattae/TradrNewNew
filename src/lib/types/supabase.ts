import { Database } from './supabase-generated'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Strategy = Database['public']['Tables']['strategies']['Row']
export type StrategyInsert = Database['public']['Tables']['strategies']['Insert']
export type StrategyUpdate = Database['public']['Tables']['strategies']['Update']

export type { Database } from './supabase-generated'

export interface Tag {
  id: string
  name: string
}

export interface ProfileWithTags extends Profile {
  tags: Tag[]
} 