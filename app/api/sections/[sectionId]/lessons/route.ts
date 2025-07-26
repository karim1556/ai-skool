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

    // Use a single transaction to get the max order and insert the new lesson
    // 1. Find the highest current order value for lessons in this section
    const lastLesson = await db.get(
      'SELECT "order" FROM lessons WHERE section_id = $1 ORDER BY "order" DESC LIMIT 1',
      [sectionId]
    );

    const newOrder = lastLesson ? lastLesson.order + 1 : 0;

    // 2. Insert the new lesson and return it in one step
    const newLesson = await db.get(
      'INSERT INTO lessons (section_id, title, duration, "order") VALUES ($1, $2, $3, $4) RETURNING *',
      [sectionId, title, duration, newOrder]
    );

    if (!newLesson) {
      return NextResponse.json({ error: 'Failed to create the lesson' }, { status: 500 });
    }

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
