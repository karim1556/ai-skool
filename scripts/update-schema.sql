-- Update courses table to include all required fields for the frontend
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS provider TEXT,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS lessons INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '0 hours',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner',
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Update existing sample course with proper data
UPDATE courses 
SET 
    provider = 'Kodable Education',
    image = '/placeholder.svg?height=200&width=300',
    price = 29.99,
    original_price = 39.99,
    lessons = 15,
    duration = '8 hours 30 minutes',
    language = 'English',
    level = 'Beginner',
    rating = 4.8,
    reviews = 124,
    students = 1250,
    category = 'Programming',
    is_free = false,
    requirements = 'No prior coding experience needed',
    meta_keywords = 'coding, programming, beginner, kids',
    meta_description = 'Learn the fundamentals of programming with this beginner-friendly course'
WHERE title = 'Sample Course';

-- Insert a few more sample courses for testing
INSERT INTO courses (
    title, description, objectives, outcomes, duration_hours, provider, image, 
    price, original_price, lessons, duration, language, level, rating, reviews, 
    students, category, is_free, requirements, meta_keywords, meta_description
) VALUES 
(
    'Advanced JavaScript Mastery',
    'Master advanced JavaScript concepts and modern ES6+ features',
    ARRAY['Learn async/await', 'Master closures', 'Understand prototypes'],
    ARRAY['Build complex applications', 'Write clean code', 'Debug effectively'],
    60,
    'Tech Academy',
    '/placeholder.svg?height=200&width=300',
    49.99,
    79.99,
    25,
    '12 hours 45 minutes',
    'English',
    'Advanced',
    4.9,
    89,
    850,
    'Web Development',
    false,
    'Basic JavaScript knowledge required',
    'javascript, advanced, es6, programming',
    'Take your JavaScript skills to the next level with advanced concepts'
),
(
    'React for Beginners',
    'Learn React from scratch and build modern web applications',
    ARRAY['Understand components', 'Learn state management', 'Build projects'],
    ARRAY['Create React apps', 'Use hooks effectively', 'Deploy applications'],
    40,
    'React Masters',
    '/placeholder.svg?height=200&width=300',
    0,
    0,
    18,
    '8 hours 15 minutes',
    'English',
    'Beginner',
    4.7,
    156,
    2100,
    'Web Development',
    true,
    'Basic HTML, CSS, and JavaScript knowledge',
    'react, frontend, components, hooks',
    'Start your React journey with this comprehensive beginner course'
) ON CONFLICT DO NOTHING;
