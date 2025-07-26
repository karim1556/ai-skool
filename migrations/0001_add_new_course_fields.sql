-- Add columns for rich course content

ALTER TABLE courses
ADD COLUMN demo_video_url TEXT,
ADD COLUMN attachments JSONB,
ADD COLUMN external_links JSONB;
