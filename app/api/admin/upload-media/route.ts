import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAuth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/db'

// NOTE: This is a minimal upload handler intended for small/medium files in dev.
// For production and large files, use a streaming parser (busboy/multiparty) or
// upload directly to S3 from the client and only store metadata on the server.

export async function POST(req: Request) {
  const auth = getAuth(req as any)
  if (!auth.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  const courseId = String(form.get('courseId') || '')
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })

  if (!file.name || !file.size) return NextResponse.json({ error: 'invalid file' }, { status: 400 })

  // Verify course exists
  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })
  try {
    const db = await getDb()
    const course = await db.get('SELECT id FROM courses WHERE id = $1', [courseId])
    if (!course) return NextResponse.json({ error: 'course not found' }, { status: 404 })
  } catch (e) {
    console.error('DB check failed', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const safeName = file.name.replace(/[^\w.\-() ]/g, '_')
  const base = path.join(process.cwd(), 'protected-videos', courseId)
  fs.mkdirSync(base, { recursive: true })
  const outPath = path.join(base, `${Date.now()}-${safeName}`)

  // For moderate sizes we can buffer; large uploads should use streaming
  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(outPath, buffer)

  // TODO: persist metadata to DB (media table) and perform validations

  return NextResponse.json({ success: true, path: `${courseId}/${path.basename(outPath)}` })
}
