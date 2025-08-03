import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;

  if (!courseId) {
    return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
  }

  try {
    const db = await getDb();

    // 1. Fetch the main course data
    const courseResult = await db.get('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (!courseResult) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 2. Fetch instructor(s)
    // For now, we'll fetch the first instructor associated with the course, matching the UI mock.
    const instructorQuery = `
      SELECT p.* 
      FROM profiles p
      JOIN course_instructors ci ON p.id = ci.instructor_id
      WHERE ci.course_id = $1
      LIMIT 1;
    `;
    const instructor = await db.get(instructorQuery, [courseId]).catch(() => null);

    // 3. Fetch curriculum (sections and lessons)
    const sectionsQuery = 'SELECT * FROM sections WHERE course_id = $1 ORDER BY "order" ASC';
    const sections = await db.all(sectionsQuery, [courseId]).catch(() => []);

    const lessonsQuery = `
      SELECT l.* 
      FROM lessons l
      JOIN sections s ON l.section_id = s.id
      WHERE s.course_id = $1
      ORDER BY s."order" ASC, l."order" ASC;
    `;
    const allLessons = await db.all(lessonsQuery, [courseId]).catch(() => []);

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
    const reviews = await db.all(reviewsQuery, [courseId]).catch(() => []);

    // Attachments and external links are now stored as JSONB in the courses table.
    // They are already part of the courseResult object.

    // 7. Assemble the final course object
    const courseDetails = {
      ...courseResult,
      instructor: instructor || null,
      curriculum: curriculum,
      reviews: reviews,
      // Use the JSONB data directly from the course object, providing empty arrays as fallbacks.
      attachments: courseResult.attachments || [], 
      external_links: courseResult.external_links || [],
      // Ensure numeric types and correct field names for UI compatibility
      rating: parseFloat(courseResult.rating) || 0,
      price: parseFloat(courseResult.price) || 0,
      original_price: parseFloat(courseResult.original_price) || null,
      enrolled_students_count: parseInt(courseResult.enrolled_students_count, 10) || 0,
      reviews_count: reviews.length,
      tagline: courseResult.tagline || 'Unlock your potential with this amazing course!',
      last_updated: courseResult.updated_at, // Pass ISO string directly
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

  const db = await getDb();

  try {
    const { 
      objectives = [], 
      demo_video_url = '', 
      attachments = [], 
      externalLinks = [] 
    } = await request.json();

    // Begin transaction
    await db.run('BEGIN', []);

    // 1. Update the main courses table
    await db.run(
      'UPDATE courses SET objectives = $1, demo_video_url = $2 WHERE id = $3',
      [objectives, demo_video_url, courseId]
    );

    // 2. Handle attachments (delete and re-insert)
    await db.run('DELETE FROM attachments WHERE course_id = $1', [courseId]);
    if (attachments.length > 0) {
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
    if (externalLinks.length > 0) {
      for (const link of externalLinks) {
        await db.run('INSERT INTO external_links (course_id, title, url) VALUES ($1, $2, $3)', [
          courseId, 
          link.title, 
          link.url
        ]);
      }
    }

    // Commit transaction
    await db.run('COMMIT', []);

    return NextResponse.json({ message: 'Course details updated successfully' });

  } catch (error) {
    // Rollback transaction on error
    await db.run('ROLLBACK', []);
    console.error('Error updating course details:', error);
    return NextResponse.json({ error: 'Failed to update course details' }, { status: 500 });
  }
}
