import { NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';
import postgres from 'postgres';

// Define interfaces for our database models to ensure type safety
interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: string; // Comes from DB as string
  original_price?: string;
  rating: string; // Comes from DB as string
  enrolled_students_count: string; // Comes from DB as string
  level: string;
  instructor_id: string;
  tagline?: string;
  updated_at: string;
  demo_video_url?: string;
  video_preview_image?: string;
  objectives?: any; // JSONB
  attachments?: any; // JSONB
  external_links?: any; // JSONB
}

interface Instructor {
  id: string;
  full_name: string;
  image: string;
}

interface Section {
  id: string;
  title: string;
  course_id: string;
  order: number;
}

interface Lesson {
  id: string;
  title: string;
  section_id: string;
  order: number;
}

interface Review {
  id: string;
  user: string; // This is an alias from the JOIN
  user_image: string;
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

  try {
    const db = getDb();

    // 1. Fetch the main course data
    const courseResult = await db.get<Course>('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (!courseResult) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 2. Fetch instructor(s)
    const instructorQuery = `
      SELECT p.* 
      FROM profiles p
      JOIN course_instructors ci ON p.id = ci.instructor_id
      WHERE ci.course_id = $1
      LIMIT 1;
    `;
    const instructor = await db.get<Instructor>(instructorQuery, [courseId]).catch(() => null);

    // 3. Fetch curriculum (sections and lessons)
    const sectionsQuery = 'SELECT * FROM sections WHERE course_id = $1 ORDER BY "order" ASC';
        const sections = await db.all<Section>(sectionsQuery, [courseId]).catch(() => []);

    const lessonsQuery = `
      SELECT l.* 
      FROM lessons l
      JOIN sections s ON l.section_id = s.id
      WHERE s.course_id = $1
      ORDER BY s."order" ASC, l."order" ASC;
    `;
        const allLessons = await db.all<Lesson>(lessonsQuery, [courseId]).catch(() => []);

    const curriculum = sections.map((section: Section) => ({
      ...section,
      lessons: allLessons.filter((lesson: Lesson) => lesson.section_id === section.id)
    }));

    // 4. Fetch reviews
    const reviewsQuery = `
      SELECT r.*, p.full_name as user, p.image as user_image
      FROM reviews r
      JOIN profiles p ON r.user_id = p.id
      WHERE r.course_id = $1
      ORDER BY r.created_at DESC;
    `;
        const reviews = await db.all<Review>(reviewsQuery, [courseId]).catch(() => []);

    const objectives = typeof courseResult.objectives === 'string' 
      ? JSON.parse(courseResult.objectives) 
      : courseResult.objectives || [];

    const courseDetails = {
      ...courseResult,
      instructor: instructor || null,
      curriculum: curriculum,
      reviews: reviews,
      objectives: objectives,
      attachments: courseResult.attachments || [], 
      external_links: courseResult.external_links || [],
      rating: parseFloat(courseResult.rating) || 0,
      price: parseFloat(courseResult.price) || 0,
      original_price: courseResult.original_price ? parseFloat(courseResult.original_price) : null,
      enrolled_students_count: parseInt(courseResult.enrolled_students_count, 10) || 0,
      reviews_count: reviews.length,
      tagline: courseResult.tagline || 'Unlock your potential with this amazing course!',
      last_updated: courseResult.updated_at,
      demo_video_url: courseResult.demo_video_url,
      video_preview_image: courseResult.video_preview_image
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
