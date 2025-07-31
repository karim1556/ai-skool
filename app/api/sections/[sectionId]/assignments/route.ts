import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

// GET handler to fetch all assignments for a section
export async function GET(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  try {
    const db = await getDb();
    
    // Ensure the assignments table exists
    await db.run(`
      CREATE TABLE IF NOT EXISTS assignments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section_id UUID NOT NULL,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        duration TEXT DEFAULT '',
        max_score NUMERIC,
        attachment_url TEXT,
        instructions TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      );
    `, []);
    
    const assignments = await db.all(
      'SELECT * FROM assignments WHERE section_id = $1 ORDER BY created_at DESC', 
      [sectionId]
    );
    
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch assignments',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      }, 
      { status: 500 }
    );
  }
}

// POST handler to create a new assignment
export async function POST(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const formData = await request.formData();
  
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const duration = formData.get('duration') as string || '';
    const maxScore = formData.get('max_score') as string;
    const file = formData.get('file') as File | null;
    const instructions = formData.get('instructions') as string || '';

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' }, 
        { status: 400 }
      );
    }

    // Validate max_score if provided
    const maxScoreNum = maxScore ? parseFloat(maxScore) : null;
    if (maxScoreNum !== null && (isNaN(maxScoreNum) || maxScoreNum < 0)) {
      return NextResponse.json(
        { error: 'Maximum score must be a positive number' }, 
        { status: 400 }
      );
    }

    let attachmentUrl = '';
    
    // Handle file upload if present
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `assignments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload assignment file' }, 
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from('course-files')
        .getPublicUrl(filePath);

      attachmentUrl = urlData.publicUrl;
    }

    const db = await getDb();
    
    try {
      // Ensure the assignments table exists with all required columns
      await db.run(`
        CREATE TABLE IF NOT EXISTS assignments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          section_id UUID NOT NULL,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          duration TEXT DEFAULT '',
          max_score NUMERIC,
          attachment_url TEXT,
          instructions TEXT DEFAULT '',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
        );
      `, []);

      const newAssignment = await db.get(
        `INSERT INTO assignments 
         (section_id, title, description, duration, max_score, attachment_url, instructions) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          sectionId, 
          title, 
          description, 
          duration, 
          maxScoreNum,
          attachmentUrl || null,
          instructions
        ]
      );

      if (!newAssignment) {
        throw new Error('Failed to create the assignment: No data returned from insert');
      }
      
      return NextResponse.json(newAssignment, { status: 201 });
      
    } catch (dbError) {
      console.error('Database error in assignments POST:', dbError);
      throw dbError;
    }

  } catch (error) {
    console.error('Failed to create assignment:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create assignment',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}