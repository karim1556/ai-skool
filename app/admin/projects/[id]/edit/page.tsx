"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function EditProjectPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/projects/${id}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (mounted) setProject(data.project)
        }
      } catch (err) { console.error(err) }
      if (mounted) setLoading(false)
    })()
    return () => { mounted = false }
  }, [id])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project)
      })
      if (res.ok) router.push('/admin/projects')
      else console.error('Failed to save')
    } finally { setSubmitting(false) }
  }

  if (loading) return <div className="p-8">Loading…</div>
  if (!project) return <div className="p-8">Not found</div>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={project.title || ''} onChange={(e) => setProject({ ...project, title: e.target.value })} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Short description</label>
          <input value={project.shortDescription || ''} onChange={(e) => setProject({ ...project, shortDescription: e.target.value })} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={project.description || ''} onChange={(e) => setProject({ ...project, description: e.target.value })} className="mt-1 block w-full border rounded-md p-2 h-36" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input value={project.category || ''} onChange={(e) => setProject({ ...project, category: e.target.value })} className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Difficulty</label>
            <input value={project.difficulty || ''} onChange={(e) => setProject({ ...project, difficulty: e.target.value })} className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input value={project.image || ''} onChange={(e) => setProject({ ...project, image: e.target.value })} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
          <Button variant="outline" onClick={() => router.push('/admin/projects')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
