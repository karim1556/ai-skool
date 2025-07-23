
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const assignments = await db.all("SELECT * FROM assignments WHERE section_id = ?", [params.sectionId]);
  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const { title } = await req.json();
  const result = await db.run("INSERT INTO assignments (section_id, title) VALUES (?, ?)", [params.sectionId, title]);
  return NextResponse.json({ id: result.lastID, title });
}