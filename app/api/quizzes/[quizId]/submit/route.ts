import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { quizId: string } }) {
  const quizId = params.quizId;
  const { answers } = await request.json(); // answers: { [questionId]: optionId }

  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
  }

  try {
    const questionIds = Object.keys(answers);
    if (questionIds.length === 0) {
      // To get total, we still need to query questions for the quiz
      const [{ count: totalQuestions }] = await sql`
        SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = ${quizId}
      `;
      return NextResponse.json({ score: 0, total: totalQuestions, results: {} });
    }

    // Get all correct options for the questions answered.
    const correctOptions = await sql`
      SELECT question_id, id as option_id
      FROM quiz_options
      WHERE question_id IN ${sql(questionIds)} AND is_correct = TRUE
    `;

    const correctAnswersMap = new Map<string, string>();
    correctOptions.forEach(opt => {
      correctAnswersMap.set(opt.question_id, opt.option_id);
    });

    let score = 0;
    const results: Record<string, boolean> = {};

    for (const questionId of questionIds) {
      const correctAnswerId = correctAnswersMap.get(questionId);
      const userAnswerId = answers[questionId];
      const isCorrect = correctAnswerId === userAnswerId;
      if (isCorrect) {
        score++;
      }
      results[questionId] = isCorrect;
    }

    // Get total number of questions for the quiz to be thorough
    const [{ count: totalQuestions }] = await sql`
      SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = ${quizId}
    `;

    return NextResponse.json({
      score,
      total: totalQuestions,
      results,
    });

  } catch (error) {
    console.error(`Failed to submit quiz ${quizId}:`, error);
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
  }
}
