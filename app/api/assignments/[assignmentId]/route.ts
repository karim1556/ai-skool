import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

interface AssignmentDetails {
  id: string;
  title: string;
  // Add other assignment-specific fields here
}

export async function GET(request: Request, { params }: { params: { assignmentId: string } }) {
  const { assignmentId } = params;
  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  const db = await getDb();

  try {
    const assignment = await db.get<AssignmentDetails>('SELECT * FROM assignments WHERE id = $1', [assignmentId]);

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error(`Failed to fetch assignment ${assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch assignment details' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { assignmentId: string } }) {
  const { assignmentId } = params;
  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  const db = await getDb();

  try {
    await db.run('DELETE FROM assignments WHERE id = $1', [assignmentId]);
    return NextResponse.json({ message: 'Assignment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete assignment ${assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { assignmentId: string } }) {
  const { assignmentId } = params;
  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  const { title } = await request.json();
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const db = await getDb();

  try {
    await db.run('UPDATE assignments SET title = $1 WHERE id = $2', [title, assignmentId]);
    const updatedAssignment = await db.get<AssignmentDetails>('SELECT * FROM assignments WHERE id = $1', [assignmentId]);
    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error(`Failed to update assignment ${assignmentId}:`, error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}
