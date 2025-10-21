import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase, hasSupabase } from '@/lib/supabase'
import { toDbProject, fromDbProject } from '@/lib/projects'

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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ project: fromDbProject(data) })
  }
  const projects = await readProjectsFile()
  const p = projects.find((x: any) => Number(x.id) === id)
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ project: p })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const body = await request.json()
    if (hasSupabase && supabase) {
      const toUpdate = toDbProject(body)
      const { data, error } = await supabase.from('projects').update(toUpdate).eq('id', id).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ project: fromDbProject(data) })
    }
    const projects = await readProjectsFile()
    const idx = projects.findIndex((x: any) => Number(x.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = { ...projects[idx], ...body }
    projects[idx] = updated
    await writeProjectsFile(projects)
    return NextResponse.json({ project: updated })
  } catch (err) {
    console.error('[API] PUT /api/projects/[id] error', err)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (hasSupabase && supabase) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  }
  const projects = await readProjectsFile()
  const idx = projects.findIndex((x: any) => Number(x.id) === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  projects.splice(idx, 1)
  await writeProjectsFile(projects)
  return NextResponse.json({ success: true })
}

