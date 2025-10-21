-- Migration: create projects table
-- Run this in your Supabase SQL editor (or via psql) to create the projects table

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT,
  difficulty TEXT,
  duration TEXT,
  image TEXT,
  youtube_link TEXT,
  code_download_link TEXT,
  circuit_diagram_link TEXT,
  instructions_link TEXT,
  views BIGINT DEFAULT 0,
  likes BIGINT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  components JSONB DEFAULT '[]'::jsonb,
  code_snippet TEXT,
  circuit_connections TEXT,
  applications TEXT,
  student_name TEXT,
  student_age TEXT,
  school TEXT,
  uses_our_components BOOLEAN DEFAULT false,
  components_from_us JSONB DEFAULT '[]'::jsonb,
  achievement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: add an index for category or tags if you plan to query by them
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
