"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminCampsList() {
  const [camps, setCamps] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/camps', { cache: 'no-store' })
      const js = await res.json()
      setCamps(js.camps || [])
    } catch (err) {
      setCamps([])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this camp?')) return
    await fetch(`/api/camps/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Camps</h1>
        <Link href="/admin/camps/new" className="btn">New Camp</Link>
      </div>
      {loading && <div>Loading…</div>}
      {!loading && camps && (
        <div className="space-y-4">
          {camps.map(c => (
            <div key={c.id} className="p-4 border rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-600">Grade: {c.grade} • ₹{c.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/camps/${c.id}`} className="text-blue-600">Edit</Link>
                <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
