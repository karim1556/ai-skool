-- Add max_attempts to quizzes table
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS max_attempts INTEGER;

-- Add duration to assignments table
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS duration TEXT;
