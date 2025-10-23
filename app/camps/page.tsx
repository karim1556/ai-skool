"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Clock,
  Calendar,
  Star,
  Zap,
  Brain,
  Cpu,
  Bot,
  Gamepad,
  Globe,
  Smartphone,
  Sparkles,
  Shield,
  Trophy,
  BookOpen,
  GraduationCap,
  Filter,
  Play,
  Download,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useState, useEffect } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function SummerCampsPage() {
  const [activeGrade, setActiveGrade] = useState("all");
  const [activeSubject, setActiveSubject] = useState("all");

  // Grade levels (static)
  const gradeLevels = [
    { id: "elementary", name: "Elementary (K-5)", range: "Grades K-5" },
    { id: "middle", name: "Middle School (6-8)", range: "Grades 6-8" },
    { id: "high", name: "High School (9-12)", range: "Grades 9-12" }
  ];

  // Camp categories (static)
  const campCategories = [
    { id: "coding", name: "Coding Camps", description: "Create games, websites, and more with beginner to advanced coding", icon: Cpu, gradient: "from-blue-500 to-cyan-500" },
    { id: "ai", name: "AI & Machine Learning", description: "Create AI apps and discover how AI is changing the world", icon: Brain, gradient: "from-purple-500 to-indigo-500" },
    { id: "robotics", name: "Robotics & Arduino", description: "Learn about designing smart devices, AI, and robots", icon: Bot, gradient: "from-green-500 to-emerald-500" },
    { id: "game-dev", name: "Game Development", description: "Build 2D and 3D games with Unity, Roblox, and Minecraft", icon: Gamepad, gradient: "from-orange-500 to-amber-500" },
    { id: "web-dev", name: "Web Development", description: "Create modern websites and mobile apps with professional tools", icon: Globe, gradient: "from-red-500 to-pink-500" },
    { id: "python", name: "Python Programming", description: "Learn top real-world programming language used by companies", icon: Zap, gradient: "from-teal-500 to-cyan-500" }
  ];
  // Dynamic camps state — will fetch from /api/camps, fallback to static file on error
  const [featuredCamps, setFeaturedCamps] = useState<any[] | null>(null)
  const [allCamps, setAllCamps] = useState<any[] | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null)
  const [startTimeFilter, setStartTimeFilter] = useState('08:00 AM')
  const [endTimeFilter, setEndTimeFilter] = useState('08:30 PM')

  // Schedule weeks: generate from today for the next 12 weeks (label for display, value is ISO start date for deep-linking and filtering)
  const generateScheduleWeeks = (count = 12) => {
    const addDays = (d: Date, days: number) => {
      const nd = new Date(d)
      nd.setDate(nd.getDate() + days)
      return nd
    }

    const formatLabel = (s: Date, e: Date) => {
      const sMonth = s.toLocaleString('default', { month: 'long' })
      const eMonth = e.toLocaleString('default', { month: 'long' })
      if (sMonth === eMonth) return `${sMonth} ${s.getDate()}-${e.getDate()}`
      const sShort = s.toLocaleString('default', { month: 'short' })
      const eShort = e.toLocaleString('default', { month: 'short' })
      return `${sShort} ${s.getDate()} - ${eShort} ${e.getDate()}`
    }

    const today = new Date()
    const weeks: { label: string; value: string }[] = []
    for (let i = 0; i < count; i++) {
      const start = addDays(today, i * 7)
      const end = addDays(start, 6)
      weeks.push({ label: formatLabel(start, end), value: start.toISOString().slice(0, 10) })
    }
    return weeks
  }

  const scheduleWeeks = generateScheduleWeeks(12)

  // normalize incoming ?week= query param: accept label (e.g. "June 9-13") or ISO date (YYYY-MM-DD)
  const normalizeWeek = (q?: string | null) => {
    if (!q) return null
    // if already ISO-ish YYYY-MM-DD, return as-is when in scheduleWeeks
    const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(q)
    if (isoMatch && scheduleWeeks.some(w => w.value === q)) return q
    // try matching by label (case-insensitive)
    const found = scheduleWeeks.find(w => w.label.toLowerCase() === String(q).toLowerCase())
    return found ? found.value : null
  }

  // Fetch camps from API on mount
  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const res = await fetch('/api/camps', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (!ignore) {
          const camps = Array.isArray(data?.camps) ? data.camps : []
          setAllCamps(camps)
          setFeaturedCamps(camps.filter((c: any) => c.featured))
        }
      } catch (e) {
        // fallback: try reading bundled data (server-side file)
        try {
          const fallback = await import('../../data/camps.json')
          if (!ignore) {
            setAllCamps(fallback.default || fallback)
            setFeaturedCamps((fallback.default || fallback).filter((c: any) => c.featured))
          }
        } catch (_) {
          if (!ignore) { setAllCamps([]); setFeaturedCamps([]) }
        }
      }
    }

    load()
    // read ?week= from URL
  const params = new URLSearchParams(window.location.search)
  const qWeek = params.get('week')
  const norm = normalizeWeek(qWeek)
  if (norm) setSelectedWeek(norm)

    return () => { ignore = true }
  }, [])

  // All camps by grade level
  const campsByGrade = {
    elementary: [
      {
        id: 4,
        title: "Scratch Junior Coding",
        description: "Start coding with Scratch Jr and make interactive stories and games",
        grade: "Grades K-2",
        duration: "4 Days",
        level: "Beginner",
        format: "Live Online",
        image: "/images/scratch-junior.jpg",
        subjects: ["coding"],
        price: 1999,
        originalPrice: 2499
      },
      {
        id: 5,
        title: "Minecraft Modeling Quest",
        description: "Solve puzzles, build, and create games with fun coding in Minecraft",
        grade: "Grades 3-6",
        duration: "1 Week",
        level: "Beginner",
        format: "Live Online",
        image: "/images/minecraft-quest.jpg",
        subjects: ["game-dev"],
        price: 2299,
        originalPrice: 2999
      },
      {
        id: 6,
        title: "Junior Robotics",
        description: "Code your robot to move, sense, lift, and more in virtual worlds",
        grade: "Grades 2-4",
        duration: "4 Days",
        level: "Beginner",
        format: "Live Online",
        image: "/images/junior-robotics.jpg",
        subjects: ["robotics"],
        price: 2099,
        originalPrice: 2699
      }
    ],
    middle: [
      {
        id: 7,
        title: "Mobile App Development",
        description: "Create powerful mobile apps and games with professional tools",
        grade: "Grades 5-10",
        duration: "1 Week",
        level: "Intermediate",
        format: "Live Online",
        image: "/images/mobile-apps.jpg",
        subjects: ["web-dev"],
        price: 2799,
        originalPrice: 3499
      },
      {
        id: 8,
        title: "Roblox Game Coding",
        description: "Create Roblox games using Lua in Roblox Studio",
        grade: "Grades 4-9",
        duration: "1 Week",
        level: "Beginner",
        format: "Live Online",
        image: "/images/roblox-coding.jpg",
        subjects: ["game-dev"],
        price: 2599,
        originalPrice: 3299
      },
      {
        id: 9,
        title: "AI Explorers",
        description: "Discover how AI fuels self-driving cars, face recognition, and advanced tech",
        grade: "Grades 4-7",
        duration: "4 Days",
        level: "Beginner",
        format: "Live Online",
        image: "/images/ai-explorers.jpg",
        subjects: ["ai"],
        price: 2399,
        originalPrice: 2999
      }
    ],
    high: [
      {
        id: 10,
        title: "Advanced Python Programming",
        description: "Master advanced Python concepts and real-world applications",
        grade: "Grades 6-12",
        duration: "1 Week",
        level: "Advanced",
        format: "Live Online",
        image: "/images/advanced-python.jpg",
        subjects: ["python"],
        price: 3299,
        originalPrice: 4199
      },
      {
        id: 11,
        title: "AP Computer Science Prep",
        description: "Comprehensive preparation for AP Computer Science Principles exam",
        grade: "Grades 9-12",
        duration: "2 Weeks",
        level: "Advanced",
        format: "Live Online",
        image: "/images/ap-computer-science.jpg",
        subjects: ["coding"],
        price: 4599,
        originalPrice: 5799
      },
      {
        id: 12,
        title: "AI Creators - Computer Vision & ChatGPT",
        description: "Master machine learning and create AI apps with Python",
        grade: "Grades 6-12",
        duration: "1 Week",
        level: "Intermediate",
        format: "Live Online",
        image: "/images/ai-creators.jpg",
        subjects: ["ai"],
        price: 3499,
        originalPrice: 4399
      }
    ]
  };

  // Benefits
  const benefits = [
    {
      icon: Award,
      title: "Expert Curriculum",
      description: "Designed by industry experts from top tech companies and universities",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Small Class Sizes",
      description: "Maximum 5 students per instructor for personalized attention",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Certificate of Achievement",
      description: "Recognize milestones with official certificates upon completion",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Trophy,
      title: "100% Satisfaction Guarantee",
      description: "We offer a satisfaction-guarantee refund policy",
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  

  // Helper to map a camp.grade string to a group id used below
  const classifyGrade = (gradeStr?: string) => {
    if (!gradeStr) return 'elementary'
    try {
      const nums = Array.from(gradeStr.matchAll(/\d+/g)).map(m => Number(m[0]))
      const max = nums.length ? Math.max(...nums) : NaN
      if (!isNaN(max)) {
        if (max >= 9) return 'high'
        if (max >= 6) return 'middle'
        return 'elementary'
      }
    } catch (err) {
      // ignore
    }
    const lower = String(gradeStr).toLowerCase()
    if (lower.includes('k')) return 'elementary'
    if (lower.includes('high') || lower.includes('9')) return 'high'
    return 'elementary'
  }

  // Filtered lists based on selected week (if provided). If the filter yields no results, fall back to showing all camps so sections don't appear empty.
  const filteredAllCampsByWeek = (() => {
    const all = allCamps || []
    if (!selectedWeek) return all
    const filtered = all.filter(c => Array.isArray(c.weeks) ? c.weeks.includes(selectedWeek) : false)
    return filtered.length ? filtered : all
  })()

  const filteredFeatured = (() => {
    const allF = featuredCamps || []
    if (!selectedWeek) return allF
    const filtered = allF.filter(c => Array.isArray(c.weeks) ? c.weeks.includes(selectedWeek) : false)
    return filtered.length ? filtered : allF
  })()

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 px-4 py-20 md:px-6 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-7xl relative">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="bg-amber-100 text-amber-700 px-4 py-2 text-sm mb-4">
                  <Sparkles className="h-4 w-4 mr-1" />
                  LIMITED TIME OFFER
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  Summer Coding Camps{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                    2025
                  </span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
                  Join the best online summer coding camps! Learn Python, Java, AI, Game Development, Robotics, and more with expert instructors. 
                  <span className="font-bold text-sky-600"> Limited time: Additional 10% off on select camps!</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#camps">
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-sky-600 px-10 py-4 text-lg font-bold text-white hover:from-sky-600 hover:to-sky-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                    VIEW ALL CAMPS
                  </Button>
                </Link>
                <Link href="#schedule">
                  <Button variant="outline" className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold">
                    <Calendar className="mr-2 h-5 w-5" />
                    SEE SCHEDULE
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                {[
                  { number: "40+", label: "Camp Topics" },
                  { number: "5:1", label: "Student Ratio" },
                  { number: "100%", label: "Satisfaction" },
                  { number: "4.9/5", label: "Rating" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-60 blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-sky-200 to-sky-300 opacity-60 blur-xl"></div>
              <div className="relative group">
                <Image
                  src="/images/summer-camps-hero.jpg"
                  alt="Summer Coding Camps 2025"
                  width={700}
                  height={500}
                  className="relative z-10 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Why Choose Our <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Summer Camps?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bring together technical expertise, educational excellence, and real-world experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <CardContent className="space-y-6 p-0">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium tracking-tight text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Camp Categories */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Explore <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Camp Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a variety of STEM subjects that every child will love
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {campCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="group border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <CardContent className="space-y-6 p-0">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{category.name}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium tracking-tight text-sm">{category.description}</p>
                    <Button variant="outline" className="w-full border-gray-300">
                      Explore Camps
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Camps */}
      <section id="camps" className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(filteredFeatured || []).map((camp) => (
                <Card key={camp.id} className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    {/* Camp Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={camp.image}
                        alt={camp.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                      {camp.popular && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-amber-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            POPULAR
                          </Badge>
                        </div>
                      )}

                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          {camp.format}
                        </Badge>
                      </div>
                    </div>

                    {/* Camp Content */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{camp.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{camp.description}</p>
                      </div>

                      {/* Camp Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-500" />
                          <span>{camp.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span>{camp.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>{camp.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span>{camp.level}</span>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          {(() => {
                            const price = Number((camp as any).price ?? 0)
                            const orig = Number((camp as any).originalPrice ?? (camp as any).original_price ?? 0)
                            const saving = (isFinite(orig) && isFinite(price)) ? Math.max(0, orig - price) : 0
                            return (
                              <>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-gray-900">₹{price}</span>
                                  {orig > 0 ? <span className="text-lg text-gray-400 line-through">₹{orig}</span> : null}
                                </div>
                                <div className="text-xs text-green-600 font-semibold">
                                  Save ₹{saving}
                                </div>
                              </>
                            )
                          })()}
                        </div>
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                          Enroll Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl">
          {(activeGrade === "all" || activeGrade === "elementary") && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Elementary School Camps (Grades K-5)</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(filteredAllCampsByWeek || []).filter(c => classifyGrade(c.grade) === 'elementary').map((camp) => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
              </div>
            </div>
          )}

          {(activeGrade === "all" || activeGrade === "middle") && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Middle School Camps (Grades 6-8)</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(filteredAllCampsByWeek || []).filter(c => classifyGrade(c.grade) === 'middle').map((camp) => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
              </div>
            </div>
          )}

          {(activeGrade === "all" || activeGrade === "high") && (
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">High School Camps (Grades 9-12)</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(filteredAllCampsByWeek || []).filter(c => classifyGrade(c.grade) === 'high').map((camp) => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-blue-50/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              2025 SCHEDULE
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Summer Camp <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Schedule</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from structured weeklong camps available in multiple time zones
            </p>
          </div>

          {/* Schedule Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Grades</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" value={activeGrade} onChange={(e) => setActiveGrade(e.target.value)}>
                  <option value="all">All Grades</option>
                  <option value="elementary">Elementary (K-5)</option>
                  <option value="middle">Middle School (6-8)</option>
                  <option value="high">High School (9-12)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" value={activeSubject} onChange={(e) => setActiveSubject(e.target.value)}>
                  <option value="all">All Subjects</option>
                  <option value="coding">Coding</option>
                  <option value="ai">AI & Machine Learning</option>
                  <option value="robotics">Robotics</option>
                  <option value="game-dev">Game Development</option>
                  <option value="web-dev">Web Development</option>
                  <option value="python">Python Programming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" value={startTimeFilter} onChange={(e) => setStartTimeFilter(e.target.value)}>
                  <option>08:00 AM</option>
                  <option>10:00 AM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                  <option>06:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" value={endTimeFilter} onChange={(e) => setEndTimeFilter(e.target.value)}>
                  <option>08:30 PM</option>
                  <option>06:30 PM</option>
                  <option>04:30 PM</option>
                  <option>02:30 PM</option>
                  <option>12:30 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Weeks */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Available Weeks</h3>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {scheduleWeeks.map((week, index) => (
                <div key={index} className={`p-4 border border-gray-200 rounded-lg transition-colors ${selectedWeek===week.value? 'ring-2 ring-blue-300': ''}`}>
                  <div className="font-semibold text-gray-900">{week.label}</div>
                  <div className="text-sm text-gray-600 mt-1">Multiple camps available</div>
                  <Button size="sm" className="w-full mt-3" onClick={() => {
                    // navigate to deep-link for this week (use machine-friendly ISO value)
                    const url = new URL(window.location.href)
                    url.searchParams.set('week', week.value)
                    window.history.pushState({}, '', url.toString())
                    setSelectedWeek(week.value)
                    const el = document.getElementById('camps')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}>
                    View Camps
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-4xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Start Your Coding Adventure?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto tracking-tight">
            Join thousands of students who have discovered their passion for technology through our summer camps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                className="rounded-full bg-white text-sky-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-xl tracking-tight"
              >
                <Phone className="mr-2 h-5 w-5" />
                SPEAK WITH ADVISOR
              </Button>
            </Link>
            <Link href="/brochure">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-sky-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200 tracking-tight"
              >
                <Download className="mr-2 h-5 w-5" />
                DOWNLOAD BROCHURE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Camp Card Component
type Camp = {
  id: number;
  title: string;
  description: string;
  grade?: string;
  duration?: string;
  schedule?: string;
  level?: string;
  format?: string;
  image?: string;
  subjects?: string[];
  price: number;
  originalPrice: number;
  popular?: boolean;
  featured?: boolean;
};

type CampCardProps = {
  camp: Camp;
};

function CampCard({ camp }: CampCardProps) {
  return (
    <Card className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{camp.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{camp.description}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-blue-500" />
            <span>{camp.grade}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>{camp.duration} • {camp.schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <span>{camp.level}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            {(() => {
              const price = Number((camp as any).price ?? 0)
              const orig = Number((camp as any).originalPrice ?? (camp as any).original_price ?? 0)
              return (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">₹{price}</span>
                  {orig > 0 ? <span className="text-md text-gray-400 line-through">₹{orig}</span> : null}
                </div>
              )
            })()}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/camps/${camp.id}`} className="text-sm inline-flex items-center px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
              Learn More
            </Link>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              Enroll
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}