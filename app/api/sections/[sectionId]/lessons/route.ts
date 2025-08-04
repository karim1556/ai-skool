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
    // First check if the sort_order column exists
    const columnCheck = await db.get(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'sort_order'", []
    );
    
    if (!columnCheck) {
      // If sort_order doesn't exist, try to add it
      try {
        await db.run('ALTER TABLE lessons ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0', []);
      } catch (alterError) {
        console.error('Failed to add sort_order column:', alterError);
      }
    }
    
    // Now try to fetch with sort_order
    const lessons = await db.all(
      'SELECT * FROM lessons WHERE section_id = $1 ORDER BY COALESCE(sort_order, 0) ASC', 
      [sectionId]
    );
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch lessons',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
    }, { status: 500 });
  }
}

// POST handler to create a new lesson
export async function POST(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const formData = await request.formData();
  
  try {
    const title = formData.get('title') as string;
    const duration = formData.get('duration') as string;
    const content = formData.get('content') as string || '';
    const is_preview = formData.get('is_preview') === 'true';
    const type = formData.get('type') as string || 'document';
    const file = formData.get('file') as File | null;

    if (!title || !duration) {
      return NextResponse.json({ error: 'Title and duration are required' }, { status: 400 });
    }

    let fileUrl = '';
    
    // Handle file upload if present
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `lessons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from('course-files')
        .getPublicUrl(filePath);

      fileUrl = urlData.publicUrl;
    }

    const db = await getDb();

    try {
      // Ensure sort_order column exists
      await db.run('ALTER TABLE lessons ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0', []);
      
      // Find the highest current sort_order value for lessons in this section
      const lastLesson = await db.get<{ sort_order: number }>(
        'SELECT sort_order FROM lessons WHERE section_id = $1 ORDER BY sort_order DESC LIMIT 1',
        [sectionId]
      );

      const newOrder = lastLesson ? lastLesson.sort_order + 1 : 0;

      // Insert the new lesson with file URL if available
      const newLesson = await db.get(
        `INSERT INTO lessons 
         (section_id, title, duration, content, is_preview, sort_order, file_url, type) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [sectionId, title, duration, content, is_preview, newOrder, fileUrl || null, type]
      );

      if (!newLesson) {
        throw new Error('Failed to create the lesson: No data returned from insert');
      }

      return NextResponse.json(newLesson, { status: 201 });
      
    } catch (dbError) {
      console.error('Database error in lessons POST:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('Failed to create lesson:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create lesson' }, 
      { status: 500 }
    );
  }
}
