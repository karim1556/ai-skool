
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

// GET handler to fetch all quizzes for a section
export async function GET(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  try {
    const db = await getDb();
    const quizzes = await db.all('SELECT * FROM quizzes WHERE section_id = $1 ORDER BY id ASC', [sectionId]);
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

// POST handler to create a new quiz
export async function POST(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  try {
    const { title, description, time_limit, passing_score } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = await getDb();

    const newQuiz = await db.get(
      'INSERT INTO quizzes (section_id, title, description, time_limit, passing_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sectionId, title, description, time_limit, passing_score]
    );

    if (!newQuiz) {
      return NextResponse.json({ error: 'Failed to create the quiz' }, { status: 500 });
    }

    return NextResponse.json(newQuiz, { status: 201 });

  } catch (error) {
    console.error('Failed to create quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}