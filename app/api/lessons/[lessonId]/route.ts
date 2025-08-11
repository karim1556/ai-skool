import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getDb } from '@/lib/db';

interface LessonDetails {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  // Add other lesson-specific fields here
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest, { params }: { params: { lessonId: string } }) {
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

export async function DELETE(request: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;
  if (!lessonId) {
    return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
  }

  const db = await getDb();

  try {
    await db.run('DELETE FROM lessons WHERE id = $1', [lessonId]);

    return NextResponse.json({ message: 'Lesson deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete lesson ${lessonId}:`, error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params;
  if (!lessonId) {
    return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const duration = formData.get('duration') as string;
    const content = formData.get('content') as string || '';
    const is_preview = formData.get('is_preview') === 'true';
    const type = formData.get('type') as string;
    const section_id = formData.get('section_id') as string;
    const file = formData.get('file') as File | null;

    if (!title || !duration || !section_id) {
      return NextResponse.json({ error: 'Title, duration, and section are required' }, { status: 400 });
    }

    const db = await getDb();
    const existingLesson = await db.get<{ file_url: string | null }>('SELECT file_url FROM lessons WHERE id = $1', [lessonId]);

    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    let fileUrl = existingLesson.file_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `lessons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload new file.' }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from('course-files').getPublicUrl(filePath);
      fileUrl = urlData.publicUrl;

      if (existingLesson.file_url) {
        try {
          const oldFileName = existingLesson.file_url.split('/').pop();
          if (oldFileName) {
            await supabase.storage.from('course-files').remove([`lessons/${oldFileName}`]);
          }
        } catch (removeError) {
          console.error('Supabase remove error:', removeError);
          // Non-fatal, just log it.
        }
      }
    }

    await db.run(
      `UPDATE lessons SET title = $1, duration = $2, content = $3, is_preview = $4, type = $5, section_id = $6, file_url = $7 WHERE id = $8`,
      [title, duration, content, is_preview, type, section_id, fileUrl, lessonId]
    );

    const updatedLesson = await db.get('SELECT * FROM lessons WHERE id = $1', [lessonId]);
    return NextResponse.json(updatedLesson);

  } catch (error) {
    console.error(`Failed to update lesson ${lessonId}:`, error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}
