import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

interface ReorderItem {
  id: string;
  type: 'lesson' | 'quiz' | 'assignment';
  sort_order: number;
}

export async function POST(request: Request) {
  try {
    const { items }: { items: ReorderItem[] } = await request.json();

    await sql.begin(async (tx) => {
      for (const item of items) {
        let tableName;
        switch (item.type) {
          case 'lesson':
            tableName = 'lessons';
            break;
          case 'quiz':
            tableName = 'quizzes';
            break;
          case 'assignment':
            tableName = 'assignments';
            break;
          default:
            continue;
        }

        if (item.type === 'lesson') {
          await tx`UPDATE lessons SET sort_order = ${item.sort_order} WHERE id = ${item.id}`;
        } else if (item.type === 'quiz') {
          await tx`UPDATE quizzes SET sort_order = ${item.sort_order} WHERE id = ${item.id}`;
        } else if (item.type === 'assignment') {
          await tx`UPDATE assignments SET sort_order = ${item.sort_order} WHERE id = ${item.id}`;
        }
      }
    });

    return NextResponse.json({ message: 'Content reordered successfully' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Failed to reorder content:', { 
      error: errorMessage,
      details: error
    });
    return NextResponse.json({ error: 'Failed to reorder content', details: errorMessage }, { status: 500 });
  }
}
