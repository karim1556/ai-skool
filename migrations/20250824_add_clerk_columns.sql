-- Add Clerk organization mapping to schools
ALTER TABLE schools ADD COLUMN IF NOT EXISTS clerk_org_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_schools_clerk_org_id ON schools(clerk_org_id);

-- Add Clerk user mapping to coordinators/trainers/students
ALTER TABLE coordinators ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_coordinators_clerk_user_id ON coordinators(clerk_user_id);

ALTER TABLE trainers ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_trainers_clerk_user_id ON trainers(clerk_user_id);

ALTER TABLE students ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_clerk_user_id ON students(clerk_user_id);
