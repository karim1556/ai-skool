import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

// GET handler to fetch all quizzes for a section
export async function GET(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const resolvedParams = await params;
  const { sectionId } = resolvedParams;
  try {
    const db = await getDb();
    const quizzes = await db.all('SELECT * FROM quizzes WHERE section_id = $1 ORDER BY created_at ASC', [sectionId]);
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' }, 
      { status: 500 }
    );
  }
}

// POST handler to create a new quiz
export async function POST(request: NextRequest, { params }: { params: { sectionId: string } }) {
  const resolvedParams = await params;
  const { sectionId } = resolvedParams;
  
  try {
    const body = await request.json();
    const { 
      title, 
      description = '', 
      time_limit = null, 
      passing_score = 70, 
      max_attempts = 3,
      instructions = '',
      questions = []
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' }, 
        { status: 400 }
      );
    }

    // Validate time_limit if provided
    if (time_limit && (isNaN(time_limit) || time_limit < 0)) {
      return NextResponse.json(
        { error: 'Time limit must be a positive number' }, 
        { status: 400 }
      );
    }

    // Validate passing_score
    if (passing_score < 0 || passing_score > 100) {
      return NextResponse.json(
        { error: 'Passing score must be between 0 and 100' }, 
        { status: 400 }
      );
    }

    // Validate max_attempts
    if (max_attempts < 1) {
      return NextResponse.json(
        { error: 'Maximum attempts must be at least 1' }, 
        { status: 400 }
      );
    }

    const db = await getDb();

    const newQuiz = await db.get(
      `INSERT INTO quizzes 
       (section_id, title, description, time_limit, passing_score, max_attempts, instructions, questions) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        sectionId, 
        title, 
        description, 
        time_limit, 
        passing_score, 
        max_attempts,
        instructions,
        JSON.stringify(questions) // Store questions as JSON
      ]
    );

    if (!newQuiz) {
      throw new Error('Failed to create the quiz');
    }

    return NextResponse.json(newQuiz, { status: 201 });

  } catch (error) {
    console.error('Failed to create quiz:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create quiz',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}