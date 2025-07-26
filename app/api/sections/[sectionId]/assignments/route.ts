
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

// GET handler to fetch all assignments for a section
export async function GET(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  try {
    const db = await getDb();
    const assignments = await db.all('SELECT * FROM assignments WHERE section_id = $1 ORDER BY id ASC', [sectionId]);
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

// POST handler to create a new assignment
export async function POST(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  try {
    const { title, description, duration, max_score, attachment_url } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = await getDb();

    const newAssignment = await db.get(
      'INSERT INTO assignments (section_id, title, description, duration, max_score, attachment_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [sectionId, title, description, duration, max_score, attachment_url]
    );

    if (!newAssignment) {
      return NextResponse.json({ error: 'Failed to create the assignment' }, { status: 500 });
    }

    return NextResponse.json(newAssignment, { status: 201 });

  } catch (error) {
    console.error('Failed to create assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}