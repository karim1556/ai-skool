
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const course = await db.get("SELECT * FROM courses WHERE id = ?", [params.id]);
  return NextResponse.json(course);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const formData = await req.formData();
  
  const course: any = {};
  formData.forEach((value, key) => {
    course[key] = value;
  });

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const imagePath = path.join(uploadDir, imageFile.name);
    await fs.writeFile(imagePath, Buffer.from(await imageFile.arrayBuffer()));
    course.image = `/uploads/${imageFile.name}`;
  }

  await db.run(
    `UPDATE courses SET
      title = ?, provider = ?, description = ?, image = ?, price = ?,
      original_price = ?, lessons = ?, duration = ?, language = ?,
      level = ?, rating = ?, reviews = ?, category = ?, is_free = ?,
      requirements = ?, outcomes = ?, meta_keywords = ?, meta_description = ?
    WHERE id = ?`,
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
      course.is_free === 'true',
      course.requirements,
      course.outcomes,
      course.meta_keywords,
      course.meta_description,
      params.id,
    ]
  );
  return NextResponse.json({ message: "Course updated" });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  await db.run("DELETE FROM courses WHERE id = ?", [params.id]);
  return NextResponse.json({ message: "Course deleted" });
} 