import Image from 'next/image'
import Link from 'next/link'

type Camp = {
  id: number | string
  title: string
  description?: string
  longDescription?: string
  tagline?: string
  grade?: string
  duration?: string
  schedule?: string
  level?: string
  format?: string
  image?: string | null
  subjects?: string[]
  price?: number
  originalPrice?: number
  popular?: boolean
  featured?: boolean
  skills?: string[]
  weeks?: string[]
  seats?: number
  rating?: number
  highlights?: string[]
  video?: string
}

import { hasSupabase, supabase } from '../../../lib/supabase'
import { getDb } from '../../../lib/db'

export default async function CampDetailPage(props: any) {
  const id = props?.params?.id

  // Try to load the camp directly from Supabase when available (server-side).
  // This avoids calling our own /api route from the server which can fail on
  // some deployment platforms. If Supabase isn't configured, try Postgres via
  // `getDb()`. If those both aren't available, fall back to fetching the
  // internal API using an absolute base URL.
  let camp: Camp | null = null
  try {
    if (hasSupabase && supabase) {
      const { data, error } = await supabase.from('camps').select('*').eq('id', id).limit(1).maybeSingle()
      if (error) throw error
      camp = data as any
    }
  } catch (err) {
    // swallow and try next source
    camp = null
  }

  if (!camp) {
    try {
      const db = getDb()
      const row = await db.get<any>('SELECT * FROM public.camps WHERE id = $1 LIMIT 1', [id])
      if (row) camp = row
    } catch (err) {
      // ignore and fallback
      camp = null
    }
  }

  if (!camp) {
    // Last-resort: fetch our internal API route. Use an absolute base so `new
    // URL()` doesn't fail in Node when a relative URL is used.
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`
      const res = await fetch(`${base}/api/camps/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const js = await res.json()
        camp = js?.camp || null
      }
    } catch (err) {
      // final fallback: leave camp null
      camp = null
    }
  }

  if (!camp) return <div className="p-8">Camp not found</div>

  function formatPrice(value?: number | null) {
    if (typeof value !== 'number') return '—'
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
    } catch {
      return `₹${value}`
    }
  }

  function formatWeekLabel(iso?: string) {
    if (!iso) return iso || ''
    try {
      const d = new Date(iso)
      return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
    } catch {
      return iso
    }
  }

  function getEmbedUrl(url?: string) {
    if (!url) return null
    // YouTube: convert watch?v= or youtu.be to embed
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v')
        if (v) return `https://www.youtube.com/embed/${v}`
      }
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace(/^\//, '')
        if (id) return `https://www.youtube.com/embed/${id}`
      }
    } catch {
      // fall through
    }
    return url
  }

  return (
    <div className="px-4 py-12 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-start gap-3">
            <h1 className="text-3xl font-bold mb-2">{camp.title}</h1>
            <div className="ml-2 flex items-center gap-2">
              {camp.featured ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Featured</span> : null}
              {camp.popular ? <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Popular</span> : null}
            </div>
          </div>
          {camp.tagline ? <p className="text-gray-600 mb-4">{camp.tagline}</p> : null}

          {camp.image ? (
            <div className="w-full h-96 relative mb-6 rounded-lg overflow-hidden shadow-lg">
              <Image src={camp.image} alt={camp.title} fill className="object-cover" />
            </div>
          ) : null}

          <div className="prose max-w-none mb-6">
            <p>{camp.description}</p>
            {camp.longDescription ? <div dangerouslySetInnerHTML={{ __html: camp.longDescription }} /> : null}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Grade</div>
              <div className="font-semibold">{camp.grade}</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-semibold">{camp.duration}</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Format</div>
              <div className="font-semibold">{camp.format}</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Seats</div>
              <div className="font-semibold">{camp.seats ?? '—'}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Skills you'll learn</h3>
            <div className="flex flex-wrap gap-2">
              {(camp.skills || []).map((s) => (
                <span key={s} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </div>

          {camp.highlights && camp.highlights.length ? (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Highlights</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {camp.highlights.map((h: string) => <li key={h}>{h}</li>)}
              </ul>
            </div>
          ) : null}

          <div>
            <h3 className="text-xl font-semibold mb-2">Schedule / Weeks</h3>
            <div className="flex flex-wrap gap-2">
              {(camp.weeks || []).map((w) => (
                <span key={w} className="px-3 py-1 rounded-lg bg-gray-100 text-sm">{formatWeekLabel(w)}</span>
              ))}
            </div>
          </div>

          {camp.video ? (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Preview</h4>
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <iframe src={getEmbedUrl(camp.video) || ''} className="w-full h-full" title="camp video" frameBorder={0} allowFullScreen />
              </div>
            </div>
          ) : null}
        </div>

        <aside className="p-6 bg-white rounded-lg shadow-lg">
          <div className="text-3xl font-bold mb-2">{formatPrice(camp.price)}</div>
          {camp.originalPrice ? (
            <div className="text-sm text-gray-400 line-through mb-2">{formatPrice(camp.originalPrice)}</div>
          ) : null}
          <div className="mb-4 text-sm text-gray-600">Rating: {camp.rating ?? '—'}</div>
          <Link href={`/register?camp=${camp.id}`} className="block text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold">Enroll Now</Link>
        </aside>
      </div>
    </div>
  )
}
