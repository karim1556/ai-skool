"use client"
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import Link from 'next/link'

interface Application {
  id: string | number
  internship_id?: string | null
  full_name?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  portfolio?: string | null
  linkedin?: string | null
  github?: string | null
  institution?: string | null
  degree?: string | null
  graduation_year?: string | null
  resume_url?: string | null
  skills?: string | null
  created_at?: string | null
}

export default function AdminInternshipApplications() {
  const [apps, setApps] = useState<Application[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/internship-applications', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch applications')
      const js = await res.json()
      const list = js?.applications || js?.data || js || []
      setApps(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Internship Applications</h1>
          <Link href="/internships" className="px-3 py-1 text-sm text-blue-600 underline">View internships</Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : apps && apps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No applications yet.</div>
        ) : (
          <div className="space-y-3">
            {apps?.map((a) => (
              <div key={(a as any).id} className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{a.full_name || '—'}</div>
                  <div className="text-sm text-gray-600">{a.email || '—'} • {a.phone || '—'}</div>
                  <div className="text-sm text-gray-500 mt-1">Internship ID: {a.internship_id || '—'}</div>
                </div>
                <div className="mt-3 md:mt-0 flex items-center gap-3">
                  {a.resume_url ? (
                    <a href={a.resume_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">View Resume</a>
                  ) : null}
                  <div className="text-sm text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
