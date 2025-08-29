"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function LevelsIndexPage() {
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/levels", { cache: "no-store" })
        const data = await res.json()
        setLevels(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold">Our Levels</h1>
          <p className="text-gray-600 mt-2">Browse levels and explore courses grouped by difficulty.</p>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : levels.length === 0 ? (
          <div className="text-gray-600">No levels available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {levels.map((l) => (
              <Link key={l.id} href={`/levels/${l.id}`}>
                <div className="rounded-lg border bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                  <div className="aspect-[16/9] bg-gray-100">
                    {l.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No thumbnail</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{l.name}</h3>
                      {l.category && <Badge variant="secondary">{l.category}</Badge>}
                    </div>
                    {l.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{l.description}</p>
                    )}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-end">
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">View Courses</Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
