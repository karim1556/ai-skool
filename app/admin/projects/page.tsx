"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Project = any

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' })
        const data = await res.json()
        if (mounted) setProjects(data.projects || [])
      } catch (err) {
        console.error('Failed to load projects', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('Delete this project?')) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) setProjects((p) => p.filter((x) => x.id !== id))
    } catch (err) { console.error(err) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Projects</h1>
        <Link href="/admin/projects/add"><Button>Add project</Button></Link>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-3">
          {projects.length === 0 && <div className="text-sm text-gray-500">No projects found</div>}
          {projects.map((p) => (
            <div key={p.id} className="p-4 border rounded-md flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title || p.name || 'Untitled'}</div>
                <div className="text-sm text-gray-600">{p.shortDescription || p.description}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/projects/${p.id}/edit`}><Button size="sm">Edit</Button></Link>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
