import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const { title } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const db = await getDb();

    // 1. Find the highest current order value for sections in this course
    const lastSection = await db.get(
      'SELECT "order" FROM sections WHERE course_id = $1 ORDER BY "order" DESC LIMIT 1',
      [courseId]
    );

    const newOrder = lastSection ? lastSection.order + 1 : 0;

    // 2. Insert the new section with the calculated order
    const result = await db.run(
      'INSERT INTO sections (course_id, title, "order") VALUES ($1, $2, $3)',
      [courseId, title, newOrder]
    );

    // In SQLite, lastID is available on the result. For node-postgres, this is different.
    // We'll fetch the newly created section to return it.
    // A more robust way might use RETURNING *, but this is broadly compatible.
    const newSection = await db.get(
      'SELECT * FROM sections WHERE course_id = $1 AND title = $2 AND "order" = $3',
      [courseId, title, newOrder]
    );

    if (!newSection) {
        // This is a fallback in case the select fails, which is unlikely
        return NextResponse.json({ error: 'Failed to create or retrieve the section' }, { status: 500 });
    }

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
