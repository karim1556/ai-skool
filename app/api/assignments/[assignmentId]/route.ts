import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

interface AssignmentDetails {
  id: string;
  title: string;
  description?: string;
  attachment_url?: string;
  file_url?: string;
  // add other fields as needed
}

export async function GET(request: Request, { params }: { params: { assignmentId: string } }) {
  const resolvedParams: any = (params && typeof (params as any).then === 'function') ? await (params as any) : params;
  const { assignmentId } = resolvedParams;
  if (!assignmentId) return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });

  try {
    const db = await getDb();
    const assignment = await db.get<AssignmentDetails>('SELECT * FROM assignments WHERE id = $1', [assignmentId]);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    return NextResponse.json(assignment);
  } catch (error) {
    console.error(`Failed to fetch assignment ${assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch assignment details' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { assignmentId: string } }) {
  const resolvedParams: any = (params && typeof (params as any).then === 'function') ? await (params as any) : params;
  const { assignmentId } = resolvedParams;
  if (!assignmentId) return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });

  try {
    const db = await getDb();
    await db.run('DELETE FROM assignments WHERE id = $1', [assignmentId]);
    return NextResponse.json({ message: 'Assignment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete assignment ${assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { assignmentId: string } }) {
  const resolvedParams: any = (params && typeof (params as any).then === 'function') ? await (params as any) : params;
  const { assignmentId } = resolvedParams;
  if (!assignmentId) return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });

  // Initialize Supabase client for possible file uploads
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  try {
    const contentType = String(request.headers.get('content-type') || '');
    let title: string | undefined;
    let description: string | undefined;
    let duration: string | undefined;
    let maxScoreRaw: string | undefined;
    let instructions: string | undefined;
    let attachmentUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title') as string | undefined;
      description = (formData.get('description') as string) || '';
      duration = (formData.get('duration') as string) || '';
      maxScoreRaw = formData.get('max_score') as string | undefined;
      instructions = (formData.get('instructions') as string) || '';

      const file = formData.get('file') as File | null;
      if (file && supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `assignments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('course-files')
          .upload(filePath, file as any);

        if (uploadError) {
          console.error('File upload error (PATCH):', uploadError);
          return NextResponse.json({ error: 'Failed to upload assignment file' }, { status: 500 });
        }

        const { data: urlData } = supabase.storage.from('course-files').getPublicUrl(filePath);
        attachmentUrl = urlData.publicUrl;
      }
    } else {
      // Try to parse JSON body
      const body = await request.json().catch(() => ({}));
      title = body.title;
      description = body.description || '';
      duration = body.duration || '';
      maxScoreRaw = body.max_score ?? body.maxScore ?? body.max_score_raw;
      instructions = body.instructions || '';
      // if client provided attachment_url directly
      attachmentUrl = body.attachment_url ?? body.attachmentUrl ?? null;
    }

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const maxScoreNum = maxScoreRaw ? parseFloat(String(maxScoreRaw)) : null;

    const db = await getDb();
    await db.run(
      `UPDATE assignments SET title = $1, description = $2, duration = $3, max_score = $4, attachment_url = $5, instructions = $6, updated_at = NOW() WHERE id = $7`,
      [title, description || '', duration || '', maxScoreNum, attachmentUrl, instructions || '', assignmentId]
    );

    const updatedAssignment = await db.get<AssignmentDetails>('SELECT * FROM assignments WHERE id = $1', [assignmentId]);
    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error(`Failed to update assignment ${assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}
