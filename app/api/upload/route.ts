import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { hasSupabase, supabase } from '@/lib/supabase'

// Upload handler: prefer Supabase Storage when configured, fall back to local filesystem
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const bucketParam = (data.get('bucket') as string) || 'internship-resumes'

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // If Supabase is configured, upload to the requested bucket (or internship-resumes)
  if (hasSupabase && supabase) {
    try {
      const bucket = bucketParam
      const filename = `${Date.now()}-${file.name}`
      const path = `${filename}`

      // Upload buffer to Supabase Storage
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      } as any)

      if (uploadError) {
        console.warn('Supabase storage upload error', uploadError)
      } else {
        // Try to create a signed URL (private buckets) or fall back to public URL
        try {
          const expiresIn = 60 * 60 // 1 hour
          const { data: signedData, error: signedErr } = await (supabase.storage.from(bucket) as any).createSignedUrl(path, expiresIn)
          if (!signedErr && signedData) {
            // support different casing
            const signed = (signedData as any).signedUrl || (signedData as any).signedURL || (signedData as any).signed || null
            if (signed) return NextResponse.json({ success: true, url: signed })
          }

          // Fallback to public URL
          const { data: publicData, error: publicErr } = await supabase.storage.from(bucket).getPublicUrl(path)
          if (!publicErr && publicData) {
            const publicUrl = (publicData as any).publicUrl || (publicData as any).publicURL || null
            if (publicUrl) return NextResponse.json({ success: true, url: publicUrl })
          }
        } catch (err) {
          console.warn('Supabase URL generation error', err)
        }
      }
    } catch (err) {
      console.error('Supabase upload failed', err)
      // fall through to filesystem fallback
    }
  }

  // Fallback: write to local public/uploads
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    const filename = `${Date.now()}-${file.name}`
    const path = join(uploadsDir, filename)
    await writeFile(path, buffer)
    const publicUrl = `/uploads/${filename}`
    return NextResponse.json({ success: true, url: publicUrl })
  } catch (error) {
    console.error('Failed to save file locally:', error)
    return NextResponse.json({ success: false, error: 'Failed to save file.' }, { status: 500 })
  }
}
