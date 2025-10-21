import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase, hasSupabase } from '@/lib/supabase'

const DATA_PATH = path.join(process.cwd(), 'data', 'projects.json')

async function readProjectsFile() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

async function writeProjectsFile(data: any) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false })
    if (error) {
      console.error('[API] supabase GET /projects error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ projects: data || [] })
  }

  const projects = await readProjectsFile()
  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (supabase) {
      const toInsert = { ...body }
      const { data, error } = await supabase.from('projects').insert([toInsert]).select().limit(1)
      if (error) {
        console.error('[API] supabase POST /projects error', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ project: data ? data[0] : null }, { status: 201 })
    }

    const projects = await readProjectsFile()
    const nextId = projects.length ? Math.max(...projects.map((p: any) => p.id)) + 1 : 1
    const newProject = { id: nextId, ...body }
    projects.unshift(newProject)
    await writeProjectsFile(projects)
    return NextResponse.json({ project: newProject }, { status: 201 })
  } catch (err) {
    console.error('[API] /api/projects error', err)
    return NextResponse.json({ error: 'Invalid payload or write error' }, { status: 400 })
  }
}

