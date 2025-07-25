import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const { instructorId } = await request.json();

  if (!courseId || !instructorId) {
    return NextResponse.json({ error: 'Course ID and Instructor ID are required' }, { status: 400 });
  }

  const db = await getDb();
  try {
    // Use a transaction to ensure atomicity
    await db.exec('BEGIN');

    // Remove existing instructor relationships for this course to ensure only one is assigned
    await db.run('DELETE FROM course_instructors WHERE course_id = $1', [courseId]);

    // Add the new instructor relationship
    await db.run('INSERT INTO course_instructors (course_id, instructor_id) VALUES ($1, $2)', [courseId, instructorId]);

    await db.exec('COMMIT');

    // Fetch the updated instructor details to return to the client for UI update
    const updatedInstructor = await db.get('SELECT id, full_name, image, title, bio FROM profiles WHERE id = $1', [instructorId]);

    return NextResponse.json(updatedInstructor);
  } catch (error) {
    // If something goes wrong, roll back the transaction
    await db.exec('ROLLBACK').catch(rollbackErr => console.error('Rollback failed:', rollbackErr));
    console.error('Failed to update instructor:', error);
    return NextResponse.json({ error: 'Failed to update instructor' }, { status: 500 });
  }
}
