import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
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
  // If supabase configured, attempt to fetch single item from DB table 'camps'
  if (hasSupabase && supabase) {
    try {
      const { data, error } = await supabase.from('camps').select('*').eq('id', id).limit(1).single()
      if (error) {
        // fall back to file
        console.warn('[API] supabase read single camp failed, falling back to file', error)
      } else {
        return NextResponse.json({ camp: data })
      }
    } catch (err: any) {
      console.warn('[API] supabase read single camp error', String(err?.message || err))
    }
  }

  const camps = await readCamps()
  const camp = camps.find((c: any) => Number(c.id) === id)
  if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ camp })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    const contentType = req.headers.get('content-type') || ''
    if (contentType.startsWith('multipart/form-data')) {
      // For simplicity, reject multipart here — admin UI will send JSON with image URLs
      return NextResponse.json({ error: 'Multipart not supported for update' }, { status: 400 })
    }
    const body = await req.json()

    if (hasSupabase && supabase) {
      try {
        const { data, error } = await supabase.from('camps').update(body).eq('id', id).select().single()
        if (!error) return NextResponse.json({ camp: data })
        console.warn('[API] supabase update returned error, falling back to file', error)
      } catch (err: any) {
        console.warn('[API] supabase update error', String(err?.message || err))
      }
    }

    const camps = await readCamps()
    const idx = camps.findIndex((c: any) => Number(c.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    camps[idx] = { ...camps[idx], ...body }
    await writeCamps(camps)
    return NextResponse.json({ camp: camps[idx] })
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    if (hasSupabase && supabase) {
      try {
        const { error } = await supabase.from('camps').delete().eq('id', id)
        if (!error) return NextResponse.json({ ok: true })
        console.warn('[API] supabase delete returned error, falling back to file', error)
      } catch (err: any) {
        console.warn('[API] supabase delete error', String(err?.message || err))
      }
    }

    const camps = await readCamps()
    const filtered = camps.filter((c: any) => Number(c.id) !== id)
    if (filtered.length === camps.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await writeCamps(filtered)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
