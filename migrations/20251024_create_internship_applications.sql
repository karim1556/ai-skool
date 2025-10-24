-- Migration: create internship_applications table
-- Run this in your Supabase SQL editor or via psql against the project's database
-- Date: 2025-10-24

-- 1) Create the table
CREATE TABLE IF NOT EXISTS public.internship_applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  internship_id TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  portfolio TEXT,
  linkedin TEXT,
  github TEXT,
  institution TEXT,
  degree TEXT,
  field TEXT,
  graduation_year TEXT,
  cgpa TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  skills TEXT,
  projects TEXT,
  why_interested TEXT,
  created_at TIMESTAMPTZ DEFAULT (now() at time zone 'utc')
);

-- 2) Useful indexes
CREATE INDEX IF NOT EXISTS idx_internship_applications_email
  ON public.internship_applications (email);

CREATE INDEX IF NOT EXISTS idx_internship_applications_created_at
  ON public.internship_applications (created_at DESC);

-- 3) OPTIONAL: Row Level Security (RLS) & policies
-- If you want to enforce RLS and allow only authenticated users to insert
-- uncomment the lines below and adapt the policies to your auth setup.

-- ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- -- Allow inserts from authenticated users (Supabase auth)
-- CREATE POLICY allow_insert_authenticated ON public.internship_applications
--   FOR INSERT
--   WITH CHECK (auth.role() IS NOT NULL);

-- -- Allow selects for authenticated users (adjust as needed)
-- CREATE POLICY allow_select_authenticated ON public.internship_applications
--   FOR SELECT USING (auth.role() IS NOT NULL);

-- Note: If your server code inserts records using the Supabase service role key
-- (recommended for server-side inserts), you don't need to enable RLS/policies
-- because service_role bypasses RLS. If you want front-end inserts from the
-- browser, create more restrictive policies and avoid exposing the service role key.
