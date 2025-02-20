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
      questions: {
        Row: {
          id: number
          title: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      principles: {
        Row: {
          id: number
          question_id: number
          title: string
          description: string | null
          examples: string | null
          status: 'testing' | 'tested'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          question_id: number
          title: string
          description?: string | null
          examples?: string | null
          status?: 'testing' | 'tested'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          question_id?: number
          title?: string
          description?: string | null
          examples?: string | null
          status?: 'testing' | 'tested'
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: number
          name: string
          type: 'good' | 'bad'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type: 'good' | 'bad'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: 'good' | 'bad'
          created_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: number
          habit_id: number
          status: 'completed' | 'failed'
          date: string
          created_at: string
        }
        Insert: {
          id?: number
          habit_id: number
          status: 'completed' | 'failed'
          date: string
          created_at?: string
        }
        Update: {
          id?: number
          habit_id?: number
          status?: 'completed' | 'failed'
          date?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: number
          title: string
          status: 'ongoing' | 'completed' | 'cancelled'
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: number
          title: string
          status?: 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          status?: 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          completed_at?: string | null
        }
      }
      focus_sessions: {
        Row: {
          id: number
          duration_minutes: number
          goal: string
          achieved: boolean
          created_at: string
        }
        Insert: {
          id?: number
          duration_minutes: number
          goal: string
          achieved: boolean
          created_at?: string
        }
        Update: {
          id?: number
          duration_minutes?: number
          goal?: string
          achieved?: boolean
          created_at?: string
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