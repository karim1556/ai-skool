
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const sections = await db.all("SELECT * FROM sections WHERE course_id = $1 ORDER BY sort_order", [params.id]);
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { title } = await req.json();
  const result = await db.run("INSERT INTO sections (course_id, title) VALUES ($1, $2) RETURNING id", [params.id, title]);
  return NextResponse.json({ id: result.lastInsertRowid, title });
}