"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'

interface Camp {
  id: number
  title: string
  grade: string
  price: number
}

export default function AdminCampsList() {
  const [camps, setCamps] = useState<Camp[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/camps', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch camps')
      const js = await res.json()
      setCamps(js.camps || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setCamps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this camp? This action cannot be undone.')) return
    try {
      const res = await fetch(`/api/camps/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete camp')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete camp')
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Camps</h1>
        <Link
          href="/admin/camps/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + New Camp
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : camps?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No camps found.{' '}
          <Link href="/admin/camps/new" className="text-blue-600 underline">
            Create your first camp
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {camps?.map((camp) => (
            <div
              key={camp.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{camp.title}</h3>
                  <p className="text-sm text-gray-600">
                    Grade: {camp.grade} • ₹{camp.price}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/camps/${camp.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(camp.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </AdminLayout>
  )
}
