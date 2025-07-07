import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole =
  | "admin"
  | "trainer"
  | "instructor"
  | "student"
  | "coordinator"
  | "school_coordinator"
  | "camp_coordinator"

export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  organization?: string
  state?: string
  district?: string
  school_name?: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description?: string
  objectives?: string[]
  outcomes?: string[]
  duration_hours?: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface Batch {
  id: string
  name: string
  course_id: string
  trainer_id: string
  coordinator_id?: string
  start_date?: string
  end_date?: string
  max_students: number
  status: "pending" | "approved" | "active" | "completed" | "cancelled"
  created_at: string
  updated_at: string
  course?: Course
  trainer?: Profile
  coordinator?: Profile
}

export interface Session {
  id: string
  batch_id: string
  title: string
  description?: string
  session_code: string
  scheduled_date?: string
  duration_minutes: number
  status: "scheduled" | "active" | "completed" | "cancelled"
  created_by: string
  created_at: string
  updated_at: string
  batch?: Batch
}
