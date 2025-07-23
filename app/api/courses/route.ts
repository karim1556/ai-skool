
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  const courses = await db.all("SELECT * FROM courses");
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const course = await req.json();
  const result = await db.run(
    `INSERT INTO courses (
      title, provider, description, image, price, original_price, lessons,
      duration, language, level, rating, reviews, category, is_free,
      requirements, outcomes, meta_keywords, meta_description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      course.title,
      course.provider,
      course.description,
      course.image,
      course.price,
      course.original_price,
      course.lessons,
      course.duration,
      course.language,
      course.level,
      course.rating,
      course.reviews,
      course.category,
      course.is_free,
      course.requirements,
      course.outcomes,
      course.meta_keywords,
      course.meta_description,
    ]
  );
  return NextResponse.json({ id: result.lastID });
}