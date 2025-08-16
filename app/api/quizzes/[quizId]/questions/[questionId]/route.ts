import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { questionId: string } }) {
  const questionId = params.questionId;
  const { question_text, options } = await request.json();

  if (!question_text || !options || !Array.isArray(options)) {
    return NextResponse.json({ error: 'Question text and options are required' }, { status: 400 });
  }

  try {
    const updatedQuestion = await sql.begin(async (tx) => {
      const [question] = await tx.unsafe(
        'UPDATE quiz_questions SET question_text = $1 WHERE id = $2 RETURNING *',
        [question_text, questionId]
      );

      await tx.unsafe('DELETE FROM quiz_options WHERE question_id = $1', [questionId]);

      const insertedOptions = [];
      for (const option of options) {
        const [insertedOption] = await tx.unsafe(
          'INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES ($1, $2, $3) RETURNING *',
          [questionId, option.option_text, option.is_correct]
        );
        insertedOptions.push(insertedOption);
      }

      return { ...question, options: insertedOptions };
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error(`Failed to update quiz question ${questionId}:`, error);
    return NextResponse.json({ error: 'Failed to update quiz question' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { questionId: string } }) {
  const questionId = params.questionId;

  try {
    await sql.unsafe('DELETE FROM quiz_questions WHERE id = $1', [questionId]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete quiz question ${questionId}:`, error);
    return NextResponse.json({ error: 'Failed to delete quiz question' }, { status: 500 });
  }
}
