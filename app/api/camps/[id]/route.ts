import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getDb } from '@/lib/db'
import { supabase, hasSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), 'data', 'camps.json')

async function readCamps() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch (err) {
    return []
  }
}

async function writeCamps(camps: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(camps, null, 2), 'utf-8')
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  // Prefer Supabase when available
  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('camps').select('*').eq('id', id).maybeSingle()
    if (error) {
      console.error('[API] supabase GET /camps/:id error', error)
      // fallback to file when Supabase query fails
      const camps = await readCamps()
      const camp = camps.find((c: any) => Number(c.id) === id)
      if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ camp })
    }
    const row = data
    if (!row) {
      const camps = await readCamps()
      const camp = camps.find((c: any) => Number(c.id) === id)
      if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ camp })
    }
    try { if (typeof row.subjects === 'string') row.subjects = JSON.parse(row.subjects) } catch {}
    try { if (typeof row.skills === 'string') row.skills = JSON.parse(row.skills) } catch {}
    try { if (typeof row.weeks === 'string') row.weeks = JSON.parse(row.weeks) } catch {}
    try { if (typeof row.highlights === 'string') row.highlights = JSON.parse(row.highlights) } catch {}
    return NextResponse.json({ camp: row })
  }

  try {
    const db = getDb()
    const row = await db.get<any>(`SELECT * FROM camps WHERE id = $1`, [id])
    if (!row) throw new Error('Not found')
    // parse json columns
    if (typeof row.subjects === 'string') {
      try { row.subjects = JSON.parse(row.subjects) } catch {}
    }
    if (typeof row.skills === 'string') {
      try { row.skills = JSON.parse(row.skills) } catch {}
    }
    if (typeof row.weeks === 'string') {
      try { row.weeks = JSON.parse(row.weeks) } catch {}
    }
    return NextResponse.json({ camp: row })
  } catch (err) {
    const camps = await readCamps()
    const camp = camps.find((c: any) => Number(c.id) === id)
    if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ camp })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    const contentType = req.headers.get('content-type') || ''
    if (contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Multipart not supported for update' }, { status: 400 })
    }
    const body = await req.json()

    const toDb: any = {
      title: body.title,
      description: body.description || null,
      long_description: body.longDescription || null,
      tagline: body.tagline || null,
      grade: body.grade || null,
      duration: body.duration || null,
      schedule: body.schedule || null,
      level: body.level || null,
      format: body.format || null,
      category: body.category || null,
      image: body.image || null,
      subjects: body.subjects ? JSON.stringify(body.subjects) : undefined,
      skills: body.skills ? JSON.stringify(body.skills) : undefined,
      weeks: body.weeks ? JSON.stringify(body.weeks) : undefined,
      price: body.price ?? undefined,
      original_price: body.originalPrice ?? undefined,
      seats: body.seats ?? undefined,
      rating: body.rating ?? undefined,
      projects: body.projects ?? undefined,
      emoji: body.emoji || undefined,
      popular: typeof body.popular === 'boolean' ? body.popular : undefined,
      featured: typeof body.featured === 'boolean' ? body.featured : undefined,
      video_preview: body.video || undefined,
      highlights: body.highlights ? JSON.stringify(body.highlights) : undefined
    }

    // Prefer Supabase update when available
    if (hasSupabase && supabase) {
      const toUpdate: any = { }
      Object.keys(toDb).forEach(k => {
        if (typeof (toDb as any)[k] !== 'undefined') {
          // convert json strings back to arrays/objects where appropriate
          if (k === 'subjects' || k === 'skills' || k === 'weeks' || k === 'highlights') {
            try { toUpdate[k] = JSON.parse((toDb as any)[k]) } catch { toUpdate[k] = (toDb as any)[k] }
          } else {
            toUpdate[k] = (toDb as any)[k]
          }
        }
      })
      if (Object.keys(toUpdate).length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      const { data, error } = await supabase.from('camps').update(toUpdate).eq('id', id).select().single()
      if (error) {
        console.error('[API] supabase PUT /camps/:id error', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ camp: data })
    }

    try {
      const db = getDb()
      // Build SET clause dynamically for non-undefined values
      const keys = Object.keys(toDb).filter(k => typeof (toDb as any)[k] !== 'undefined')
      if (keys.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      const sets = keys.map((k, i) => `${k} = $${i + 1}`)
      const vals = keys.map(k => (toDb as any)[k])
      const sql = `UPDATE camps SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ${id}`
      await db.run(sql, vals)
      const updated = await db.get<any>(`SELECT * FROM camps WHERE id = $1`, [id])
      return NextResponse.json({ camp: updated })
    } catch (err) {
      const camps = await readCamps()
      const idx = camps.findIndex((c: any) => Number(c.id) === id)
      if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      camps[idx] = { ...camps[idx], ...body }
      await writeCamps(camps)
      return NextResponse.json({ camp: camps[idx] })
    }
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    try {
      const db = getDb()
      await db.run(`DELETE FROM camps WHERE id = $1`, [id])
      return NextResponse.json({ ok: true })
    } catch (err) {
      const camps = await readCamps()
      const filtered = camps.filter((c: any) => Number(c.id) !== id)
      if (filtered.length === camps.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      await writeCamps(filtered)
      return NextResponse.json({ ok: true })
    }
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
