
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Ensure uploaded file names are safe for Supabase Storage keys
function sanitizeFileName(name: string): string {
  const dotIdx = name.lastIndexOf('.')
  const rawBase = dotIdx > 0 ? name.slice(0, dotIdx) : name
  const rawExt = dotIdx > 0 ? name.slice(dotIdx + 1) : ''
  // Remove diacritics, spaces, unusual unicode (e.g., narrow no-break spaces)
  const normalized = rawBase.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  const safeBase = normalized
    .replace(/[^a-zA-Z0-9-_]+/g, '-') // keep alnum, dash, underscore
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'file'
  const safeExt = (rawExt || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
  return safeExt ? `${safeBase}.${safeExt}` : safeBase
}

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

    // Optional association with a level
    const rawLevelId = formData.get("level_id") as string | null;
    const levelId = rawLevelId ? parseInt(rawLevelId, 10) : null;

    // Handle image upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const fileName = `thumbnails/${Date.now()}-${sanitizeFileName(imageFile.name)}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-thumbnails')
        .upload(fileName, imageFile, { contentType: imageFile.type || undefined, upsert: false, cacheControl: '3600' });

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('course-thumbnails')
        .getPublicUrl(fileName);

      imagePath = urlData.publicUrl;
    }

    // Handle demo video input: prefer uploaded file when provided, otherwise use URL field
    const demoVideoFile = formData.get("demo_video_file") as File | null;
    // If user supplied a URL in the form, capture it now (will be used only if no file is uploaded)
    const providedDemoVideoUrl = (formData.get("demo_video_url") as string | null) || '';
    let demoVideoUrl = '';

    if (demoVideoFile && demoVideoFile.size > 0) {
      const videoFileName = `videos/${Date.now()}-${sanitizeFileName(demoVideoFile.name)}`;
      const { data: videoUploadData, error: videoUploadError } = await supabase.storage
        .from('course-videos') // A separate bucket for videos
        .upload(videoFileName, demoVideoFile, { contentType: demoVideoFile.type || undefined, upsert: false, cacheControl: '3600' });

      if (videoUploadError) {
        throw new Error(`Failed to upload demo video: ${videoUploadError.message}`);
      }

      const { data: videoUrlData } = supabase.storage
        .from('course-videos')
        .getPublicUrl(videoFileName);

      demoVideoUrl = videoUrlData.publicUrl;
    } else if (providedDemoVideoUrl && providedDemoVideoUrl.trim().length > 0) {
      demoVideoUrl = providedDemoVideoUrl.trim();
    }

    // Process other form fields
    formData.forEach((value, key) => {
      if (key === 'image' || key.startsWith('attachment_files')) return;

      try {
        if (['objectives', 'external_links', 'outcomes'].includes(key)) {
          course[key] = JSON.parse(value as string);
        } else {
          course[key] = value;
        }
      } catch (e) {
        if (['price', 'original_price', 'lessons', 'rating', 'reviews', 'students'].includes(key)) {
          course[key] = parseFloat(value as string) || 0;
        } else if (key === 'is_free') {
          course[key] = value === 'true';
        } else {
          course[key] = value;
        }
      }
    });

    // Handle attachments upload
    const attachmentFiles = formData.getAll("attachment_files") as File[];
    const attachmentTitles = formData.getAll("attachment_titles") as string[];
    const attachmentsData = [];

    for (let i = 0; i < attachmentFiles.length; i++) {
      const file = attachmentFiles[i];
      const title = attachmentTitles[i];
      if (file && file.size > 0) {
        const fileName = `attachments/${Date.now()}-${sanitizeFileName(file.name)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-thumbnails') // Using the same bucket for simplicity
          .upload(fileName, file, { contentType: file.type || undefined, upsert: false, cacheControl: '3600' });

        if (uploadError) {
          console.error(`Failed to upload attachment ${file.name}:`, uploadError);
          continue; // Skip this file and continue with the next
        }

        const { data: urlData } = supabase.storage
          .from('course-thumbnails')
          .getPublicUrl(fileName);
        
        attachmentsData.push({ title, url: urlData.publicUrl });
      }
    }

    // Define the expected shape of the result from the INSERT...RETURNING query
    interface InsertResult {
      id: string;
    }

    // Use db.get with the correct type to retrieve the inserted row
    const result = await db.get<InsertResult>(
      `INSERT INTO courses (
        title, description, objectives, outcomes, created_by,
        provider, image, price, original_price, lessons, duration, language,
        level, rating, reviews, students, category, is_free, requirements,
        meta_keywords, meta_description, demo_video_url, attachments, external_links
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING id`,
      [
        course.title || '',
        course.description || '',
        JSON.stringify(course.objectives || []),
        JSON.stringify(course.outcomes || []),
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
        course.meta_description || '',
        demoVideoUrl,
        JSON.stringify(attachmentsData || []),
        JSON.stringify(course.external_links || [])
      ]
    );
    
    if (!result) {
      throw new Error('Course creation failed: No result returned from database.');
    }

    // After inserting the course, if a level was provided, create the mapping
    if (levelId && Number.isFinite(levelId)) {
      await db.run(
        "INSERT INTO level_courses (level_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [levelId, result.id]
      );
    }

    // Correctly get the ID from the returned row object
    return NextResponse.json({
      id: result.id,
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