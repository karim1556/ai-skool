-- Migration: create camps table
-- Run this in Supabase SQL editor or your Postgres instance.

CREATE TABLE IF NOT EXISTS public.camps (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  grade text,
  duration text,
  schedule text,
  level text,
  format text,
  category text,
  image text,
  subjects jsonb DEFAULT '[]'::jsonb,
  skills jsonb DEFAULT '[]'::jsonb,
  weeks jsonb DEFAULT '[]'::jsonb,
  price numeric(10,2) DEFAULT 0,
  original_price numeric(10,2) DEFAULT 0,
  seats integer DEFAULT 20,
  rating numeric(3,1) DEFAULT 4.5,
  projects integer DEFAULT 0,
  emoji text,
  popular boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index on featured/popular for faster public queries
CREATE INDEX IF NOT EXISTS idx_camps_featured ON public.camps (featured);
CREATE INDEX IF NOT EXISTS idx_camps_popular ON public.camps (popular);
CREATE INDEX IF NOT EXISTS idx_camps_category ON public.camps (category);
CREATE INDEX IF NOT EXISTS idx_camps_grade ON public.camps (grade);

-- Notes:
-- The application sends/uses camelCase JSON keys (e.g. originalPrice, createdAt).
-- In Postgres the recommended column names are snake_case (e.g. original_price, created_at).
-- When inserting/updating via Supabase/pg you can send camelCase in the JSON body and map to the columns,
-- or translate keys server-side. Keep this in mind when switching the API to Supabase.

-- Example insert (optional)
-- INSERT INTO public.camps (title, description, grade, price, original_price, featured) VALUES ('Intro to Python', 'Learn Python', 'Grades 6-9', 1999, 2499, true);
