
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const quizzes = await db.all("SELECT * FROM quizzes WHERE section_id = $1", [params.sectionId]);
  return NextResponse.json(quizzes);
}

export async function POST(req: NextRequest, { params }: { params: { sectionId: string } }) {
  const db = await getDb();
  const { title } = await req.json();
  const newQuiz = await db.get("INSERT INTO quizzes (section_id, title) VALUES ($1, $2) RETURNING *", [params.sectionId, title]);

  if (!newQuiz) {
    return NextResponse.json({ error: 'Failed to create the quiz' }, { status: 500 });
  }

  return NextResponse.json(newQuiz, { status: 201 });
}