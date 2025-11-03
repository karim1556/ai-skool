import { NextResponse } from 'next/server';
import { getDb, dbStatus } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  if (!sectionId) {
    return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
  }

  const db = await getDb();

  // If DB isn't initialized, return a helpful error instead of a raw 500
  try {
    const status = dbStatus();
    if (!status.ready) {
      console.error('Database not initialized:', status.error);
      return NextResponse.json({ error: `Database not initialized: ${status.error || 'missing POSTGRES_URL'}` }, { status: 500 });
    }
  } catch (e) {
    // ignore - we'll rely on the try/catch below
  }

  try {
    // Use a transaction to ensure all or nothing is deleted
    await db.run('BEGIN');

    // Delete all content associated with the section first
    await db.run('DELETE FROM lessons WHERE section_id = $1', [sectionId]);
    await db.run('DELETE FROM quizzes WHERE section_id = $1', [sectionId]);
    await db.run('DELETE FROM assignments WHERE section_id = $1', [sectionId]);

    // Finally, delete the section itself
    await db.run('DELETE FROM sections WHERE id = $1', [sectionId]);

    await db.run('COMMIT');

    return NextResponse.json({ message: 'Section and all its content deleted successfully' }, { status: 200 });
  } catch (error) {
    await db.run('ROLLBACK');
    console.error(`Failed to delete section ${sectionId}:`, error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  if (!sectionId) {
    return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const { title, sort_order } = body as { title?: string; sort_order?: number };

  if (title === undefined && sort_order === undefined) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const db = await getDb();

  try {
    if (title !== undefined) {
      await db.run('UPDATE sections SET title = $1 WHERE id = $2', [title, sectionId]);
    }
    if (sort_order !== undefined) {
      await db.run('UPDATE sections SET sort_order = $1 WHERE id = $2', [sort_order, sectionId]);
    }

    const updatedSection = await db.get('SELECT * FROM sections WHERE id = $1', [sectionId]);
    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error(`Failed to update section ${sectionId}:`, error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
