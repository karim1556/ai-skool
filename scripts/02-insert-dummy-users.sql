-- Insert dummy users for testing different dashboards
-- Note: In a real Supabase setup, you would create these users through the auth system
-- This script creates the profile records assuming the auth users exist

-- First, let's create some sample courses
INSERT INTO public.courses (id, title, description, objectives, outcomes, duration_hours, created_by) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Web Development Fundamentals',
  'Learn the basics of web development including HTML, CSS, and JavaScript',
  ARRAY['Understand HTML structure', 'Style with CSS', 'Add interactivity with JavaScript'],
  ARRAY['Build responsive websites', 'Create interactive web applications'],
  40,
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Data Science with Python',
  'Introduction to data science concepts and Python programming',
  ARRAY['Learn Python basics', 'Understand data analysis', 'Work with libraries like Pandas'],
  ARRAY['Analyze datasets', 'Create data visualizations', 'Build predictive models'],
  60,
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Digital Marketing Essentials',
  'Comprehensive guide to digital marketing strategies and tools',
  ARRAY['Understand SEO basics', 'Learn social media marketing', 'Master email campaigns'],
  ARRAY['Create marketing campaigns', 'Analyze marketing metrics', 'Build brand presence'],
  30,
  '550e8400-e29b-41d4-a716-446655440000'
);

-- Insert dummy profiles (these would normally be created through Supabase Auth)
-- Admin User
INSERT INTO public.profiles (id, email, full_name, phone, role, organization, state, district, is_approved) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@eduflow.com',
  'System Administrator',
  '+1234567890',
  'admin',
  'EduFlow LMS',
  'California',
  'San Francisco',
  true
);

-- Trainer User
INSERT INTO public.profiles (id, email, full_name, phone, role, organization, state, district, is_approved) VALUES
(
  '550e8400-e29b-41d4-a716-446655440010',
  'trainer@eduflow.com',
  'John Smith',
  '+1234567891',
  'trainer',
  'Tech Training Institute',
  'California',
  'Los Angeles',
  true
);

-- Instructor User
INSERT INTO public.profiles (id, email, full_name, phone, role, organization, state, district, is_approved) VALUES
(
  '550e8400-e29b-41d4-a716-446655440020',
  'instructor@eduflow.com',
  'Sarah Johnson',
  '+1234567892',
  'instructor',
  'Digital Learning Academy',
  'New York',
  'Manhattan',
  true
);

-- Student User
INSERT INTO public.profiles (id, email, full_name, phone, role, organization, state, district, school_name, is_approved) VALUES
(
  '550e8400-e29b-41d4-a716-446655440030',
  'student@eduflow.com',
  'Mike Davis',
  '+1234567893',
  'student',
  'State University',
  'Texas',
  'Austin',
  'Austin High School',
  true
);

-- School Coordinator
INSERT INTO public.profiles (id, email, full_name, phone, role, organization, state, district, school_name, is_approved) VALUES
(
  '550e8400-e29b-41d4-a716-446655440040',
  'coordinator@eduflow.com',
  'Emily Wilson',
  '+1234567894',
  'school_coordinator',
  'Springfield School District',
  'Illinois',
  'Springfield',
  'Springfield Elementary',
  true
);

-- Camp Coordinator
INSERT INTO public.profiles (id, email, full_name, phone, role, organization, state, district, is_approved) VALUES
(
  '550e8400-e29b-41d4-a716-446655440050',
  'camp@eduflow.com',
  'David Brown',
  '+1234567895',
  'camp_coordinator',
  'Summer Tech Camp',
  'Florida',
  'Miami',
  true
);

-- Create some sample batches
INSERT INTO public.batches (id, name, course_id, trainer_id, coordinator_id, start_date, end_date, max_students, status) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  'Web Dev Batch 2024-A',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440040',
  '2024-01-15',
  '2024-03-15',
  25,
  'active'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  'Data Science Batch 2024-A',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440020',
  '550e8400-e29b-41d4-a716-446655440050',
  '2024-02-01',
  '2024-04-30',
  20,
  'pending'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  'Digital Marketing Batch 2024-A',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440040',
  '2024-01-20',
  '2024-02-20',
  30,
  'approved'
);

-- Enroll student in batches
INSERT INTO public.batch_enrollments (batch_id, student_id, is_approved) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440030',
  true
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440030',
  true
);

-- Create some sample sessions
INSERT INTO public.sessions (id, batch_id, title, description, scheduled_date, duration_minutes, status, created_by) VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'HTML Fundamentals',
  'Introduction to HTML structure and semantic elements',
  '2024-01-16 10:00:00+00',
  120,
  'completed',
  '550e8400-e29b-41d4-a716-446655440010'
),
(
  '770e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440001',
  'CSS Styling',
  'Learn CSS selectors, properties, and responsive design',
  '2024-01-18 10:00:00+00',
  120,
  'scheduled',
  '550e8400-e29b-41d4-a716-446655440010'
),
(
  '770e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440003',
  'Digital Marketing Strategy',
  'Overview of digital marketing channels and strategies',
  '2024-01-22 14:00:00+00',
  120,
  'scheduled',
  '550e8400-e29b-41d4-a716-446655440010'
);

-- Add some attendance records
INSERT INTO public.attendance (session_id, student_id, trainer_id, login_time, logout_time, is_present) VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440030',
  '550e8400-e29b-41d4-a716-446655440010',
  '2024-01-16 10:05:00+00',
  '2024-01-16 12:00:00+00',
  true
);

-- Create some assignments
INSERT INTO public.assignments (id, batch_id, title, description, due_date, max_score, created_by) VALUES
(
  '880e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'Build Your First Website',
  'Create a personal portfolio website using HTML and CSS',
  '2024-01-25 23:59:00+00',
  100,
  '550e8400-e29b-41d4-a716-446655440010'
),
(
  '880e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440003',
  'Marketing Campaign Analysis',
  'Analyze a successful digital marketing campaign and present findings',
  '2024-01-30 23:59:00+00',
  100,
  '550e8400-e29b-41d4-a716-446655440010'
);

-- Add assignment submission
INSERT INTO public.assignment_submissions (assignment_id, student_id, submission_text, score, submitted_at, graded_at) VALUES
(
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440030',
  'I have created a portfolio website showcasing my projects and skills. The website includes responsive design and follows modern web standards.',
  85,
  '2024-01-24 18:30:00+00',
  '2024-01-25 09:15:00+00'
);
