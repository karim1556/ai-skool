-- Migration: Add label to level_courses mapping
ALTER TABLE level_courses ADD COLUMN IF NOT EXISTS label TEXT DEFAULT 'Easy';
-- You can use 'difficulty' instead of 'label' if you prefer
-- Existing rows will default to 'Easy', update as needed via admin UI
