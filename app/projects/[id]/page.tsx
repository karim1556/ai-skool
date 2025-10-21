import { notFound } from 'next/navigation'
import { supabase, hasSupabase } from '@/lib/supabase'
import { promises as fs } from 'fs'
import path from 'path'

type Project = any

const DATA_PATH = path.join(process.cwd(), 'data', 'projects.json')

async function readProjectsFile() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  let project: Project | null = null

  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
    if (error) {
      // fall back to file if not found
      project = null
    } else {
      project = data as Project
    }
  }

  if (!project) {
    const projects = await readProjectsFile()
    project = projects.find((p: any) => Number(p.id) === id) || null
  }

  if (!project) return notFound()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 mb-4">{project.shortDescription}</p>
      <div className="prose">
        <p>{project.description}</p>
      </div>
    </div>
  )
}
