
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { sections } = await req.json();

  const promises = sections.map((section: { id: number; sort_order: number }, index: number) => {
    return db.run("UPDATE sections SET sort_order = ? WHERE id = ? AND course_id = ?", [
      index,
      section.id,
      params.id,
    ]);
  });

  await Promise.all(promises);

  return NextResponse.json({ message: "Sections sorted" });
}