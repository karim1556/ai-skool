
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const lessons = await db.all("SELECT * FROM lessons WHERE section_id = $1 ORDER BY sort_order", [params.sectionId]);
  return NextResponse.json(lessons);
}

export async function POST(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const { title, type } = await req.json();
  const result = await db.run("INSERT INTO lessons (section_id, title, type) VALUES ($1, $2, $3) RETURNING id", [
    params.sectionId,
    title,
    type,
  ]);
  return NextResponse.json({ id: result.lastInsertRowid, title, type });
}