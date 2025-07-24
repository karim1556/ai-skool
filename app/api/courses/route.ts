
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  const courses = await db.all("SELECT * FROM courses");
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  
  try {
    const formData = await req.formData();
    const course: { [key: string]: any } = {};
    let imagePath = '/placeholder.svg?height=200&width=300';

    // Handle image upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const newImagePath = path.join(uploadDir, imageFile.name);
      await fs.writeFile(newImagePath, Buffer.from(await imageFile.arrayBuffer()));
      imagePath = `/uploads/${imageFile.name}`;
    }

    // Process other form fields
    formData.forEach((value, key) => {
      if (key === 'image') return;

      if (key === 'objectives' || key === 'outcomes') {
        course[key] = (value as string).split(',').map(item => item.trim());
      } else if (['price', 'original_price', 'lessons', 'rating', 'reviews', 'students', 'duration_hours'].includes(key)) {
        course[key] = parseFloat(value as string) || 0;
      } else if (key === 'is_free') {
        course[key] = value === 'true';
      } else {
        course[key] = value;
      }
    });

    const result = await db.run(
      `INSERT INTO courses (
        title, description, objectives, outcomes, duration_hours, created_by,
        provider, image, price, original_price, lessons, duration, language,
        level, rating, reviews, students, category, is_free, requirements,
        meta_keywords, meta_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING id`,
      [
        course.title || '',
        course.description || '',
        course.objectives || [],
        course.outcomes || [],
        course.duration_hours || 0,
        course.created_by || null,
        course.provider || '',
        imagePath,
        course.price || 0,
        course.original_price || 0,
        course.lessons || 0,
        course.duration || '0 hours',
        course.language || 'English',
        course.level || 'Beginner',
        course.rating || 0,
        course.reviews || 0,
        course.students || 0,
        course.category || '',
        course.is_free || false,
        course.requirements || '',
        course.meta_keywords || '',
        course.meta_description || ''
      ]
    );
    
    return NextResponse.json({ 
      id: result.lastInsertRowid,
      success: true 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}