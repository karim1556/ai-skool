import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const { title, duration } = await request.json();

  if (!title || !duration) {
    return NextResponse.json({ error: 'Title and duration are required' }, { status: 400 });
  }

  try {
    const db = await getDb();

    // 1. Find the highest current order value for lessons in this section
    const lastLesson = await db.get(
      'SELECT "order" FROM lessons WHERE section_id = $1 ORDER BY "order" DESC LIMIT 1',
      [sectionId]
    );

    const newOrder = lastLesson ? lastLesson.order + 1 : 0;

    // 2. Insert the new lesson
    await db.run(
      'INSERT INTO lessons (section_id, title, duration, "order") VALUES ($1, $2, $3, $4)',
      [sectionId, title, duration, newOrder]
    );

    // 3. Fetch and return the newly created lesson
    const newLesson = await db.get(
      'SELECT * FROM lessons WHERE section_id = $1 AND title = $2 AND "order" = $3',
      [sectionId, title, newOrder]
    );

    if (!newLesson) {
      return NextResponse.json({ error: 'Failed to create or retrieve the lesson' }, { status: 500 });
    }

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
