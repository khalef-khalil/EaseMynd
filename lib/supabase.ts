import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Since we're using server-side rendering
  }
});

// Types for your tables
export type Tables = {
  questions: {
    id: number;
    title: string;
    category: string;
    created_at: string;
    updated_at: string;
  };
  principles: {
    id: number;
    question_id: number;
    title: string;
    description: string | null;
    examples: string | null;
    status: 'testing' | 'tested';
    created_at: string;
    updated_at: string;
  };
  habits: {
    id: number;
    name: string;
    type: 'good' | 'bad';
    created_at: string;
  };
  habit_logs: {
    id: number;
    habit_id: number;
    status: 'completed' | 'failed';
    date: string;
    created_at: string;
  };
  tasks: {
    id: number;
    title: string;
    status: 'ongoing' | 'completed' | 'cancelled';
    created_at: string;
    completed_at: string | null;
  };
  focus_sessions: {
    id: number;
    duration_minutes: number;
    goal: string;
    achieved: boolean;
    created_at: string;
  };
}; 