
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const quizzes = await db.all("SELECT * FROM quizzes WHERE section_id = ?", [params.sectionId]);
  return NextResponse.json(quizzes);
}

export async function POST(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const { title } = await req.json();
  const result = await db.run("INSERT INTO quizzes (section_id, title) VALUES (?, ?)", [params.sectionId, title]);
  return NextResponse.json({ id: result.lastID, title });
}