import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

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
  // Add other instructor fields if necessary
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
  user_image: string; // This is an alias from the JOIN
  // Add other review fields if necessary
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

    const curriculum = sections.map(section => ({
      ...section,
      lessons: allLessons.filter(lesson => lesson.section_id === section.id)
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

    // Attachments and external links are now stored as JSONB in the courses table.
    // They are already part of the courseResult object.

    // 7. Assemble the final course object
    const courseDetails = {
      ...courseResult,
      instructor: instructor || null,
      curriculum: curriculum,
      reviews: reviews,
      attachments: courseResult.attachments || [], 
      external_links: courseResult.external_links || [],
      // Ensure all numeric fields are correctly parsed and sent as numbers
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

  const db = getDb();

  try {
    const { 
      objectives = [], 
      demo_video_url = '', 
      attachments = [], 
      externalLinks = [] 
    } = await request.json() as UpdateCoursePayload;

    // Begin transaction
    await db.run('BEGIN');

    // 1. Update the main courses table
    await db.run(
      'UPDATE courses SET objectives = $1, demo_video_url = $2 WHERE id = $3',
      [objectives, demo_video_url || '', courseId]
    );

    // 2. Handle attachments (delete and re-insert)
    await db.run('DELETE FROM attachments WHERE course_id = $1', [courseId]);
    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        await db.run('INSERT INTO attachments (course_id, title, url) VALUES ($1, $2, $3)', [
          courseId, 
          att.title, 
          att.url
        ]);
      }
    }

    // 3. Handle external links (delete and re-insert)
    await db.run('DELETE FROM external_links WHERE course_id = $1', [courseId]);
    if (externalLinks && externalLinks.length > 0) {
      for (const link of externalLinks) {
        await db.run('INSERT INTO external_links (course_id, title, url) VALUES ($1, $2, $3)', [
          courseId, 
          link.title, 
          link.url
        ]);
      }
    }

    // Commit transaction
    await db.run('COMMIT');

    return NextResponse.json({ message: 'Course details updated successfully' });

  } catch (error) {
    // Rollback transaction on error
    await db.run('ROLLBACK');
    console.error('Error updating course details:', error);
    return NextResponse.json({ error: 'Failed to update course details' }, { status: 500 });
  }
}
