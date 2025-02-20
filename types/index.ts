import type { Database } from './supabase';

export type Question = Database['public']['Tables']['questions']['Row'];
export type Principle = Database['public']['Tables']['principles']['Row'];
export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitLog = Database['public']['Tables']['habit_logs']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type FocusSession = Database['public']['Tables']['focus_sessions']['Row'];

export const QUESTION_CATEGORIES = [
  'Social Skills & Communication',
  'Mental Health & Emotions',
  'Physical Health & Fitness',
  'Career & Professional Growth',
  'Money & Finance',
  'Time Management & Productivity',
  'Learning & Education',
  'Family & Relationships',
  'Hobbies & Recreation',
  'Home & Organization'
] as const;

export type QuestionCategory = typeof QUESTION_CATEGORIES[number];

// Remove unused PRINCIPLE_CATEGORIES since principles are now tied to questions 