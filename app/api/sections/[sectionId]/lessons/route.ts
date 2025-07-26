import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';

// GET handler to fetch all lessons for a section
export async function GET(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  try {
    const db = await getDb();
    const lessons = await db.all('SELECT * FROM lessons WHERE section_id = $1 ORDER BY "order" ASC', [sectionId]);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

// POST handler to create a new lesson
export async function POST(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  try {
    const { title, duration, content, is_preview } = await request.json();

    if (!title || !duration) {
      return NextResponse.json({ error: 'Title and duration are required' }, { status: 400 });
    }

    const db = await getDb();

    // 1. Find the highest current order value for lessons in this section
    const lastLesson = await db.get(
      'SELECT "order" FROM lessons WHERE section_id = $1 ORDER BY "order" DESC LIMIT 1',
      [sectionId]
    );

    const newOrder = lastLesson ? lastLesson.order + 1 : 0;

    // 2. Insert the new lesson and return it in one step using the 'get' method which returns the first row
    const newLesson = await db.get(
      'INSERT INTO lessons (section_id, title, duration, content, is_preview, "order") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [sectionId, title, duration, content, is_preview, newOrder]
    );

    if (!newLesson) {
      return NextResponse.json({ error: 'Failed to create the lesson' }, { status: 500 });
    }

    return NextResponse.json(newLesson, { status: 201 });

  } catch (error) {
    console.error('Failed to create lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
