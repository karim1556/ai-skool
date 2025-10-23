import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Award, 
  CheckCircle, 
  Play,
  ArrowRight,
  GraduationCap,
  Zap,
  Shield,
  Trophy
} from 'lucide-react'

type Camp = {
  category: string
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

  // ... (your existing data fetching logic remains the same)
  let camp: Camp | null = null
  try {
    if (hasSupabase && supabase) {
      const { data, error } = await supabase.from('camps').select('*').eq('id', id).limit(1).maybeSingle()
      if (error) throw error
      camp = data as any
    }
  } catch (err) {
    camp = null
  }

  if (!camp) {
    try {
      const db = getDb()
      const row = await db.get<any>('SELECT * FROM public.camps WHERE id = $1 LIMIT 1', [id])
      if (row) camp = row
    } catch (err) {
      camp = null
    }
  }

  if (!camp) {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`
      const res = await fetch(`${base}/api/camps/${id}`, { cache: 'no-store' })
      if (res.ok) {
        const js = await res.json()
        camp = js?.camp || null
      }
    } catch (err) {
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

  const discount = camp.originalPrice && camp.price ? 
    Math.round(((camp.originalPrice - camp.price) / camp.originalPrice) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/camps" className="hover:text-blue-600 transition-colors">Summer Camps</Link>
            <span>•</span>
            <span className="text-gray-400">{camp.category || 'Coding Camp'}</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {camp.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                  {camp.popular && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <Trophy className="w-3 h-3 mr-1" />
                      Most Popular
                    </span>
                  )}
                  {camp.level && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {camp.level}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {camp.title}
                </h1>
                
                {camp.tagline && (
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {camp.tagline}
                  </p>
                )}

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4">
                  {camp.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[1,2,3,4,5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.floor(camp.rating!) 
                                ? 'text-amber-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {camp.rating}/5
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{camp.seats || 'Limited'} seats available</span>
                  </div>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Grade Level</div>
                    <div className="font-semibold text-gray-900">{camp.grade || 'All Grades'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-semibold text-gray-900">{camp.duration || 'Flexible'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Schedule</div>
                    <div className="font-semibold text-gray-900">{camp.schedule || 'Custom'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <Zap className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-500">Format</div>
                    <div className="font-semibold text-gray-900">{camp.format || 'Live Online'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Image/Video */}
            <div className="relative">
              {camp.image ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src={camp.image} 
                    alt={camp.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  {camp.video && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30 hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </button>
                    </div>
                  )}
                </div>
              ) : camp.video ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
                  <iframe 
                    src={getEmbedUrl(camp.video) || ''} 
                    className="w-full h-full"
                    title="Camp preview video"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="text-white text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-lg font-semibold">Summer Coding Camp</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description Section */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 text-blue-600 mr-3" />
                About This Camp
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {camp.description}
                </p>
                {camp.longDescription && (
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: camp.longDescription }} 
                  />
                )}
              </div>
            </section>

            {/* Skills Section */}
            {camp.skills && camp.skills.length > 0 && (
              <section className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="w-6 h-6 text-amber-600 mr-3" />
                  Skills You'll Master
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {camp.skills.map((skill, index) => (
                    <div 
                      key={skill}
                      className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100 group hover:bg-blue-100 transition-colors"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{skill}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Highlights Section */}
            {camp.highlights && camp.highlights.length > 0 && (
              <section className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 text-green-600 mr-3" />
                  Camp Highlights
                </h2>
                <div className="grid gap-4">
                  {camp.highlights.map((highlight, index) => (
                    <div 
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{highlight}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Schedule Section */}
            {camp.weeks && camp.weeks.length > 0 && (
              <section className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                  Available Weeks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {camp.weeks.map((week, index) => (
                    <div 
                      key={week}
                      className="p-4 bg-white border-2 border-purple-200 rounded-xl text-center hover:border-purple-400 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="text-sm text-purple-600 font-medium mb-1">Week {index + 1}</div>
                      <div className="font-semibold text-gray-900">{formatWeekLabel(week)}</div>
                      <div className="text-xs text-gray-500 mt-1">Multiple sessions available</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Enrollment Card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Enrollment Card */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="text-center mb-6">
                    {discount > 0 && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-3">
                        🎉 Save {discount}%
                      </div>
                    )}
                    
                    <div className="flex items-baseline justify-center space-x-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(camp.price)}
                      </span>
                      {camp.originalPrice && camp.originalPrice > (camp.price || 0) && (
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(camp.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      One-time payment • Certificate included
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Seats Available</span>
                      <span className="font-semibold text-gray-900">{camp.seats || 'Limited'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Skill Level</span>
                      <span className="font-semibold text-gray-900">{camp.level || 'Beginner'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Format</span>
                      <span className="font-semibold text-gray-900">{camp.format || 'Live Online'}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/register?camp=${camp.id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </Link>
                </div>

                {/* Guarantee Section */}
                <div className="bg-gray-50 border-t border-gray-200 p-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>100% satisfaction guarantee • 7-day money back</span>
                  </div>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-4 text-lg">Need Help Deciding?</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Free consultation available</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Speak with our experts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Curriculum preview</span>
                  </li>
                </ul>
                <button className="w-full mt-4 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                  Schedule Call
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}