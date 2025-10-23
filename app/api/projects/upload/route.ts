import { NextResponse } from 'next/server'
import { supabase, hasSupabase } from '@/lib/supabase'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
  const form = await req.formData()
  const file = form.get('file') as File | null
  // allow client to suggest a bucket name (optional)
  const clientBucket = String(form.get('bucket') || '') || null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const originalName = (file.name || 'upload').replace(/\s+/g, '-')
    const filename = `${Date.now()}-${originalName}`

    if (hasSupabase && supabase) {
      // If an explicit bucket is configured, try it first. Otherwise try a list
      // of candidate buckets used elsewhere in this project.
      const configured = process.env.SUPABASE_STORAGE_BUCKET
      // If client provided a bucket, prefer it.
      const candidateBuckets = clientBucket ? [clientBucket] : (configured ? [configured] : [])
      // add fallback candidates
      for (const b of ['projects', 'course-thumbnails', 'course-files']) {
        if (!candidateBuckets.includes(b)) candidateBuckets.push(b)
      }
      let lastError: any = null
      for (const bucket of candidateBuckets) {
        try {
          const { data, error } = await supabase.storage.from(bucket).upload(filename, buffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'application/octet-stream',
          })
          if (error) {
            // If bucket not found, try next candidate. Otherwise surface error.
            lastError = error
            const msg = String(error?.message || '')
            if (msg.toLowerCase().includes('bucket not found') || String(error?.statusCode) === '404') {
              continue
            }
            console.error('[API] supabase upload error', error)
            return NextResponse.json({ error: error.message || error }, { status: 500 })
          }
          // success - return public url from this bucket
          const { data: urlData } = await supabase.storage.from(bucket).getPublicUrl(filename)
          return NextResponse.json({ url: urlData.publicUrl })
        } catch (err: any) {
          lastError = err
          // If this looks like bucket-not-found, try next
          if (String(err?.message || '').toLowerCase().includes('bucket not found') || String(err?.statusCode) === '404') {
            continue
          }
          console.error('[API] supabase upload error', err)
          return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
        }
      }
      // If we reached here, none of the candidate buckets accepted the upload
      console.error('[API] supabase upload error - no candidate bucket found', lastError)
      // fall through to filesystem fallback
    }

    // Fallback: write to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    const outPath = path.join(uploadsDir, filename)
    await fs.writeFile(outPath, buffer)
    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('[API] upload error', err)
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
