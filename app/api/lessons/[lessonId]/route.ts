import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

interface LessonDetails {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  // Add other lesson-specific fields here
}

export async function GET(request: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;
  if (!lessonId) {
    return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
  }

  const db = await getDb();

  try {
    const lesson = await db.get<LessonDetails>('SELECT * FROM lessons WHERE id = $1', [lessonId]);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error(`Failed to fetch lesson ${lessonId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch lesson details' }, { status: 500 });
  }
}
