import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { supabase, hasSupabase } from '@/lib/supabase'

const DATA_PATH = path.join(process.cwd(), 'data', 'camps.json')

async function readCamps() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

async function writeCamps(camps: any[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(camps, null, 2), 'utf-8')
}

export async function GET() {
  // Prefer Supabase when configured, then Postgres via getDb(), then file fallback
  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('camps').select('*').order('id', { ascending: false })
    if (error) {
      console.error('[API] supabase GET /camps error', error)
      // fallback to file when Supabase query fails
      const camps = await readCamps()
      return NextResponse.json({ camps })
    }
    // if Supabase table is empty, fallback to bundled file so local/dev matches deployed seed
    if (!data || data.length === 0) {
      const camps = await readCamps()
      if (camps && camps.length) return NextResponse.json({ camps })
    }
    const parsed = (data || []).map((r: any) => {
      const out = { ...r }
      // ensure json columns are parsed
      if (typeof out.subjects === 'string') {
        try { out.subjects = JSON.parse(out.subjects) } catch {}
      }
      if (typeof out.skills === 'string') {
        try { out.skills = JSON.parse(out.skills) } catch {}
      }
      if (typeof out.weeks === 'string') {
        try { out.weeks = JSON.parse(out.weeks) } catch {}
      }
      if (typeof out.highlights === 'string') {
        try { out.highlights = JSON.parse(out.highlights) } catch {}
      }
      return out
    })
    return NextResponse.json({ camps: parsed })
  }

  // fallback to Postgres via getDb
  try {
    const db = getDb()
    const rows = await db.all<any>(`SELECT * FROM camps ORDER BY created_at DESC`)
    const parsed = rows.map((r: any) => {
      const out = { ...r }
      if (typeof out.subjects === 'string') {
        try { out.subjects = JSON.parse(out.subjects) } catch {}
      }
      if (typeof out.skills === 'string') {
        try { out.skills = JSON.parse(out.skills) } catch {}
      }
      if (typeof out.weeks === 'string') {
        try { out.weeks = JSON.parse(out.weeks) } catch {}
      }
      return out
    })
    return NextResponse.json({ camps: parsed })
  } catch (err) {
    const camps = await readCamps()
    return NextResponse.json({ camps })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const toDb = {
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
      subjects: body.subjects ? JSON.stringify(body.subjects) : '[]',
      skills: body.skills ? JSON.stringify(body.skills) : '[]',
      weeks: body.weeks ? JSON.stringify(body.weeks) : '[]',
      price: body.price ?? 0,
      original_price: body.originalPrice ?? 0,
      seats: body.seats ?? 20,
      rating: body.rating ?? 0,
      projects: body.projects ?? 0,
      emoji: body.emoji || null,
      popular: body.popular ? true : false,
      featured: body.featured ? true : false,
      created_at: body.createdAt || new Date().toISOString(),
      video_preview: body.video || null,
      highlights: body.highlights ? JSON.stringify(body.highlights) : null
    }

    // Prefer Supabase insert when configured
    if (hasSupabase && supabase) {
      const toInsert: any = {
        title: toDb.title,
        description: toDb.description,
        long_description: toDb.long_description,
        tagline: toDb.tagline,
        grade: toDb.grade,
        duration: toDb.duration,
        schedule: toDb.schedule,
        level: toDb.level,
        format: toDb.format,
        category: toDb.category,
        image: toDb.image,
        subjects: JSON.parse(toDb.subjects || '[]'),
        skills: JSON.parse(toDb.skills || '[]'),
        weeks: JSON.parse(toDb.weeks || '[]'),
        price: toDb.price,
        original_price: toDb.original_price,
        seats: toDb.seats,
        rating: toDb.rating,
        projects: toDb.projects,
        emoji: toDb.emoji,
        popular: toDb.popular,
        featured: toDb.featured,
        created_at: toDb.created_at,
        video_preview: toDb.video_preview,
        highlights: toDb.highlights ? JSON.parse(toDb.highlights) : null
      }
      const { data, error } = await supabase.from('camps').insert([toInsert]).select().limit(1)
      if (error) {
        console.error('[API] supabase POST /camps error', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ camp: data ? data[0] : null }, { status: 201 })
    }

    // fallback to Postgres via getDb
    try {
      const db = getDb()
      await db.run(
        `INSERT INTO camps (
          title, description, long_description, tagline, grade, duration, schedule, level, format, category,
          image, subjects, skills, weeks, price, original_price, seats, rating, projects, emoji,
          popular, featured, created_at, video_preview, highlights
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12::jsonb,$13::jsonb,$14::jsonb,$15,$16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25::jsonb
        )`,
        [
          toDb.title, toDb.description, toDb.long_description, toDb.tagline, toDb.grade, toDb.duration,
          toDb.schedule, toDb.level, toDb.format, toDb.category, toDb.image, toDb.subjects, toDb.skills,
          toDb.weeks, toDb.price, toDb.original_price, toDb.seats, toDb.rating, toDb.projects, toDb.emoji,
          toDb.popular, toDb.featured, toDb.created_at, toDb.video_preview, toDb.highlights
        ]
      )
      const saved = await db.get<any>(`SELECT * FROM camps WHERE id = (SELECT max(id) FROM camps)`) 
      return NextResponse.json({ camp: saved }, { status: 201 })
    } catch (err) {
      const camps = await readCamps()
      const id = (camps[camps.length - 1]?.id || 0) + 1
      const newCamp = { id, ...body }
      camps.push(newCamp)
      await writeCamps(camps)
      return NextResponse.json({ camp: newCamp }, { status: 201 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message || 'Failed' }, { status: 500 })
  }
}
