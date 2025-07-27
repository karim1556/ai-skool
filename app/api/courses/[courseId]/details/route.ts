import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';

// GET handler to fetch all details for the course content manager
export async function GET(request: NextRequest, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const db = await getDb();

  try {
    const course = await db.get('SELECT * FROM courses WHERE id = $1', [courseId]);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch instructor, gracefully handle if not found
    let instructor = null;
    if (course.created_by) {
        try {
            instructor = await db.get('SELECT id, full_name, image, title FROM profiles WHERE id = $1', [course.created_by]);
        } catch (e) {
            console.warn(`Could not fetch instructor for course ${courseId}:`, e)
        }
    }

    // Fetch all content in parallel for efficiency
    const [sections, lessons, quizzes, assignments] = await Promise.all([
      db.all('SELECT * FROM sections WHERE course_id = $1 ORDER BY sort_order', [courseId]),
      db.all('SELECT * FROM lessons WHERE section_id IN (SELECT id FROM sections WHERE course_id = $1) ORDER BY sort_order', [courseId]),
      db.all('SELECT * FROM quizzes WHERE section_id IN (SELECT id FROM sections WHERE course_id = $1) ORDER BY sort_order', [courseId]),
      db.all('SELECT * FROM assignments WHERE section_id IN (SELECT id FROM sections WHERE course_id = $1) ORDER BY sort_order', [courseId]),
    ]);

    // Combine all content types into a single lessons array for each section
    const sectionsWithContent = sections.map(section => ({
      ...section,
      lessons: lessons.filter(l => l.section_id === section.id),
      quizzes: quizzes.filter(q => q.section_id === section.id),
      assignments: assignments.filter(a => a.section_id === section.id),
    }));

    return NextResponse.json({ 
      ...course, 
      instructor,
      sections: sectionsWithContent 
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}

// PUT handler to update course details
export async function PUT(request: NextRequest, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const db = await getDb();

  try {
    const body = await request.json();

    // List of fields that are expected to be JSONB in the database
    const jsonFields = ['objectives', 'requirements', 'attachments', 'external_links'];

    // Dynamically build the update query to handle partial updates
    const fieldsToUpdate = { ...body };
    const setClauses: string[] = [];
    const queryParams: any[] = [];

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      // Do not try to update the course ID or other read-only fields
      if (key === 'id' || key === 'created_at' || key === 'updated_at') return;

      queryParams.push(jsonFields.includes(key) && value !== null ? JSON.stringify(value) : value);
      setClauses.push(`${key} = $${queryParams.length}`);
    });

    if (setClauses.length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    // Add the courseId to the end of the parameters for the WHERE clause
    queryParams.push(courseId);
    const query = `
      UPDATE courses 
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${queryParams.length} 
      RETURNING *`;

    const updatedCourse = await db.get(query, queryParams);

    if (!updatedCourse) {
      return NextResponse.json({ error: 'Course not found or failed to update' }, { status: 404 });
    }

    return NextResponse.json(updatedCourse);

  } catch (error) {
    const err = error as Error;
    console.error('Error updating course details:', err);
    // Provide a more specific error message if it's a JSON parsing issue
    if (err.message.includes('syntax error')) {
        return NextResponse.json({ error: 'Invalid JSON format in request body.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update course details', details: err.message }, { status: 500 });
  }
}
