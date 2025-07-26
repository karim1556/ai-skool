import { NextResponse, NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
  const formData = await request.formData();
  
  try {
    const title = formData.get('title') as string;
    const duration = formData.get('duration') as string;
    const content = formData.get('content') as string;
    const is_preview = formData.get('is_preview') === 'true';
    const file = formData.get('file') as File | null;

    if (!title || !duration) {
      return NextResponse.json({ error: 'Title and duration are required' }, { status: 400 });
    }

    let fileUrl = '';
    
    // Handle file upload if present
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `lessons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from('course-files')
        .getPublicUrl(filePath);

      fileUrl = urlData.publicUrl;
    }

    const db = await getDb();

    // Find the highest current order value for lessons in this section
    const lastLesson = await db.get(
      'SELECT "order" FROM lessons WHERE section_id = $1 ORDER BY "order" DESC LIMIT 1',
      [sectionId]
    );

    const newOrder = lastLesson ? lastLesson.order + 1 : 0;

    // Insert the new lesson with file URL if available
    const newLesson = await db.get(
      'INSERT INTO lessons (section_id, title, duration, content, is_preview, "order", file_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [sectionId, title, duration, content, is_preview, newOrder, fileUrl || null]
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
