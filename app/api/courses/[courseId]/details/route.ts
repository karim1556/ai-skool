import { NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';
import postgres from 'postgres';

// Define types for our data structures
interface Instructor {
  name: string;
  image: string;
  title: string;
  bio: string;
  courses_count: number;
  students_count: number;
  average_rating: number;
  reviews_count: number;
}

interface Review {
  id: string;
  user: string;
  user_image: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Course {
  id: string;
  created_by: string; // Used to fetch instructor
  curriculum?: Section[];
  instructor?: Instructor | null;
  reviews?: Review[];
}

interface SectionContent {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
}

interface Section {
  id: string;
  title: string;
  lessons: SectionContent[];
}

interface UpdateCoursePayload {
  objectives?: string[];
  demo_video_url?: string;
  attachments?: { title: string; url: string }[];
  externalLinks?: { title: string; url: string }[];
}

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  if (!courseId) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
  }

  const db = await getDb();

  try {
    // 1. Fetch the main course data
    const course = await db.get<Course>('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 2. Fetch all sections for the course
    const sections = await db.all<Section>('SELECT * FROM sections WHERE course_id = $1', [courseId]);

    // 3. For each section, fetch all of its content
    for (const section of sections) {
      const lessons = await db.all<SectionContent>(
        `SELECT id, title, 'lesson' as type FROM lessons WHERE section_id = $1`,
        [section.id]
      );
      const quizzes = await db.all<SectionContent>(
        `SELECT id, title, 'quiz' as type FROM quizzes WHERE section_id = $1`,
        [section.id]
      );
      const assignments = await db.all<SectionContent>(
        `SELECT id, title, 'assignment' as type FROM assignments WHERE section_id = $1`,
        [section.id]
      );

      // Combine all content
      section.lessons = [...lessons, ...quizzes, ...assignments];
    }

    // 4. Attach the fully populated sections to the course object
    course.curriculum = sections;

    // 5. Fetch instructor details
    let instructor = null;
    if (course.created_by) {
      const instructorQuery = `
        SELECT 
          p.full_name as name, 
          p.avatar_url as image, 
          i.title as title,
          i.bio as bio,
          (SELECT COUNT(*) FROM courses WHERE created_by = i.user_id) as courses_count,
          (SELECT SUM(enrolled_students_count) FROM courses WHERE created_by = i.user_id) as students_count,
          (SELECT AVG(rating) FROM reviews r JOIN courses c ON r.course_id = c.id WHERE c.created_by = i.user_id) as average_rating,
          (SELECT COUNT(*) FROM reviews r JOIN courses c ON r.course_id = c.id WHERE c.created_by = i.user_id) as reviews_count
        FROM instructors i
        JOIN profiles p ON i.user_id = p.id
        WHERE i.user_id = $1;
      `;
      instructor = await db.get(instructorQuery, [course.created_by]).catch(() => null);
    }

    // 6. Fetch reviews with user details
    const reviewsQuery = `
      SELECT r.*, p.full_name as user, p.avatar_url as user_image
      FROM reviews r
      JOIN profiles p ON r.user_id = p.id
      WHERE r.course_id = $1
      ORDER BY r.created_at DESC;
    `;
    const reviews = await db.all(reviewsQuery, [courseId]).catch(() => []);

    // 7. Combine all data into a single response object
    const courseDetails = {
      ...course,
      instructor,
      curriculum: sections,
      reviews,
    };

    return NextResponse.json(courseDetails);

  } catch (error) {
    console.error('Error fetching course details:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to fetch course details.',
      details: errorMessage 
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  if (!courseId) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
  }

  try {
    const payload: UpdateCoursePayload = await request.json();
    const {
      objectives = [],
      demo_video_url = '',
      attachments = [],
      externalLinks,
    } = payload;

    const external_links = externalLinks || [];

    await sql.begin(async (tx: postgres.Sql) => {
      await tx`
        UPDATE courses
        SET 
          objectives = ${JSON.stringify(objectives)},
          demo_video_url = ${demo_video_url || ''},
          attachments = ${JSON.stringify(attachments)},
          external_links = ${JSON.stringify(external_links)}
        WHERE id = ${courseId}
      `;
    });

    return NextResponse.json({ message: 'Course updated successfully' });

  } catch (error) {
    console.error('Failed to update course:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to update course.',
      details: errorMessage 
    }, { status: 500 });
  }
}
