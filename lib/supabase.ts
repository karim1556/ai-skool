import { createClient } from '@supabase/supabase-js'

// Read env vars (prefer server-side service role key when available)
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create a Supabase client when both URL and key are present. This
// preserves the previous file-backed fallback for local/dev use when envs are
// not configured. Export `hasSupabase` so callers can explicitly check.
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY)
export const supabase = hasSupabase ? (createClient(SUPABASE_URL, SUPABASE_KEY) as any) : null

export async function ensureProjectsTable() {
  // Creating tables programmatically is not done here. Use SQL migrations or
  // the Supabase dashboard to create a `projects` table with the columns you need.
  return
}

// Minimal shared types used across the codebase. These are intentionally
// lightweight and can be expanded to match your real schema.
export type UserRole =
  | 'admin'
  | 'trainer'
  | 'instructor'
  | 'student'
  | 'coordinator'
  | 'school_coordinator'
  | 'camp_coordinator'

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  role?: UserRole
  organization?: string
  state?: string
  district?: string
  school_name?: string
  is_approved?: boolean
  created_at?: string
  updated_at?: string
}

export interface Course {
  id: string
  title: string
  description?: string
  duration_hours?: number
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Batch {
  id: string
  name: string
  course_id: string
  trainer_id: string
  coordinator_id?: string
  start_date?: string
  end_date?: string
  max_students?: number
  status?: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled'
  created_at?: string
  updated_at?: string
  course?: Course
  trainer?: Profile
  coordinator?: Profile
}

export interface Session {
  id: string
  batch_id?: string
  title?: string
  description?: string
  session_code?: string
  scheduled_date?: string
  duration_minutes?: number
  status?: 'scheduled' | 'active' | 'completed' | 'cancelled'
  created_by?: string
  created_at?: string
  updated_at?: string
  batch?: Batch
}

