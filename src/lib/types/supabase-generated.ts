export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      strategies: {
        Row: {
          id: string
          strategy_id: string
          user_id: string
          title: string
          description: string | null
          hashtags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          strategy_id: string
          user_id: string
          title: string
          description?: string | null
          hashtags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          strategy_id?: string
          user_id?: string
          title?: string
          description?: string | null
          hashtags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}




