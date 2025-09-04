-- This script creates the missing tables for curriculum content (Quizzes and Assignments).
-- Running this in your Supabase SQL Editor will resolve the 500 errors.

-- Create Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
    sort_order INTEGER DEFAULT 0,
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- The following policies are basic security rules.
-- You may need to adjust them later based on your app's specific needs.

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- POLICIES for Quizzes
CREATE POLICY "Allow all users to view quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert quizzes" ON quizzes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update quizzes" ON quizzes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete quizzes" ON quizzes FOR DELETE USING (auth.role() = 'authenticated');

-- POLICIES for Assignments
CREATE POLICY "Allow all users to view assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert assignments" ON assignments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update assignments" ON assignments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete assignments" ON assignments FOR DELETE USING (auth.role() = 'authenticated');
