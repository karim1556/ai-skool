
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const assignments = await db.all("SELECT * FROM assignments WHERE section_id = $1", [params.sectionId]);
  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const { title } = await req.json();
  const newAssignment = await db.get("INSERT INTO assignments (section_id, title) VALUES ($1, $2) RETURNING *", [params.sectionId, title]);

  if (!newAssignment) {
    return NextResponse.json({ error: 'Failed to create the assignment' }, { status: 500 });
  }

  return NextResponse.json(newAssignment, { status: 201 });
}