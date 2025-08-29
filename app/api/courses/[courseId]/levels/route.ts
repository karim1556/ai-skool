import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ensureLevelsSchema } from "@/lib/levels-schema";

export async function GET(_request: Request, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const db = await getDb();
    await ensureLevelsSchema();
    const rows = await db.all(
      `SELECT l.* FROM level_courses lc
       JOIN levels l ON l.id = lc.level_id
       WHERE lc.course_id = $1
       ORDER BY l.level_order ASC, l.id ASC`,
      [String(courseId)]
    );

    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to load levels for course" }, { status: 500 });
  }
}
