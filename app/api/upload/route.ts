import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// This is a simplified mock file upload handler.
// In a real-world application, you would upload to a cloud storage service
// like AWS S3, Google Cloud Storage, or Cloudinary and return the public URL.
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Store the file in the public directory to make it accessible via a URL.
  const filename = `${Date.now()}-${file.name}`;
  const path = join(process.cwd(), 'public', 'uploads', filename);

  try {
    // Ensure the uploads directory exists
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    // Return the public URL of the uploaded file
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error('Failed to save file:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file.' }, { status: 500 });
  }
}
