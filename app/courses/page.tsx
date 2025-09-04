"use client"

import { CourseFilter } from "@/components/course-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid, List, RefreshCw, Clock, Star, BookOpen, ShoppingCart, Search } from "lucide-react"
import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CoursesPage() {
  const router = useRouter()
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [catalogType, setCatalogType] = useState<"courses" | "levels">("courses")
  const [filters, setFilters] = useState({
    category: "All category",
    price: "All",
    level: "All",
    levelId: "All" as string | "All",
    language: "All",
    rating: "All",
  })
  const [cartItems, setCartItems] = useState<number[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      // If a specific level is selected, fetch courses by level
      if (filters.levelId && filters.levelId !== 'All') {
        const res = await fetch(`/api/levels/${filters.levelId}/courses`)
        const data = await res.json()
        setAllCourses(Array.isArray(data) ? data : [])
      } else {
        const res = await fetch("/api/courses")
        const data = await res.json()
        setAllCourses(Array.isArray(data) ? data : [])
      }
    }
    if (catalogType === 'courses') fetchCourses()
  }, [filters.levelId, catalogType])

  // Fetch levels when in Levels mode
  useEffect(() => {
    const fetchLevels = async () => {
      const res = await fetch('/api/levels', { cache: 'no-store' })
      const data = await res.json()
      setLevels(Array.isArray(data) ? data : [])
    }
    if (catalogType === 'levels') fetchLevels()
  }, [catalogType])

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (filters.category !== "All category" && course.category !== filters.category) return false
      if (filters.price === "Free" && !course.is_free) return false
      if (filters.price === "Paid" && course.is_free) return false
      // When fetching by levelId we already filtered, otherwise allow optional text-level filter
      if ((!filters.levelId || filters.levelId === 'All') && filters.level !== "All" && course.level !== filters.level) return false
      if (filters.language !== "All" && course.language !== filters.language) return false
      if (filters.rating !== "All" && course.rating < Number.parseInt(filters.rating)) return false
      return true
    })
  }, [filters, allCourses])

  const handleEnrollNow = (e: React.MouseEvent, courseId: number) => {
    e.preventDefault()
    if (!cartItems.includes(courseId)) {
      setCartItems([...cartItems, courseId])
    }
    router.push("/cart")
  }

  const handleAddToCart = (e: React.MouseEvent, courseId: number) => {
    e.preventDefault()
    if (!cartItems.includes(courseId)) {
      setCartItems([...cartItems, courseId])
    }
  }

  const handleRefresh = () => {
    setFilters({
      category: "All category",
      price: "All",
      level: "All",
      levelId: "All",
      language: "All",
      rating: "All",
    })
  }

  const CourseCard = ({ course, isListView }: { course: any; isListView: boolean }) => {
    const numericRating = typeof course.rating === 'string' ? parseFloat(course.rating) : (course.rating || 0);

    return (
      <Link href={`/courses/${course.id}`} passHref>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
          <div className={isListView ? "flex flex-col md:flex-row" : "flex flex-col"}>
            <Image
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              width={isListView ? 200 : 400}
              height={isListView ? 120 : 225}
              className={`object-cover ${isListView ? "md:w-1/3 rounded-l-lg" : "w-full h-48 rounded-t-lg"}`}
            />
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3">By {course.provider}</p>
                {isListView && <p className="text-sm text-gray-600 mb-4 hidden md:block">{course.description}</p>}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-sm font-semibold text-yellow-500 mr-1">{numericRating.toFixed(1)}</span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(numericRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({course.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{course.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{course.duration} Hours</span>
                  </div>
                  <Badge variant="outline" className="py-0.5 px-2 text-xs">{course.level}</Badge>
                  {course.language && <Badge variant="outline" className="py-0.5 px-2 text-xs">{course.language}</Badge>}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div>
                  {course.is_free ? (
                    <span className="text-2xl font-bold text-green-600">Free</span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-pink-600">₹{course.price}</span>
                      {course.original_price && (
                        <span className="text-md text-gray-400 line-through">₹{course.original_price}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={(e) => handleAddToCart(e, course.id)}>
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={(e) => handleEnrollNow(e, course.id)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  const LevelCard = ({ level }: { level: any }) => {
    const onAddToCart = (e: React.MouseEvent) => {
      e.preventDefault()
      router.push('/cart')
    }
    const onView = (e: React.MouseEvent) => {
      // allow navigation
      e.stopPropagation()
    }
    const hasDiscount = typeof level.original_price === 'number' && typeof level.price === 'number' && level.original_price > level.price
    return (
      <Link href={`/levels/${level.id}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
          <div className="w-full h-48 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {level.thumbnail ? (
              <img src={level.thumbnail} alt={level.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No thumbnail</div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-gray-900">{level.name}</h3>
              {level.category && <Badge variant="secondary">{level.category}</Badge>}
            </div>
            {level.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{level.description}</p>
            )}
            <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                {level.is_free ? (
                  <span className="text-xl font-bold text-green-600">Free</span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    {typeof level.price === 'number' && (
                      <span className="text-xl font-bold text-pink-600">₹{level.price}</span>
                    )}
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">₹{level.original_price}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={onAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={onView} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  View Courses
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {catalogType === 'courses' ? 'Our Courses' : 'Our Levels'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {catalogType === 'courses'
              ? 'Explore our wide range of courses and find the perfect one for you.'
              : 'Browse levels and discover grouped courses by difficulty.'}
          </p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600 font-medium">
            {catalogType === 'courses'
              ? <>Showing {filteredCourses.length} of {allCourses.length} courses</>
              : <>Showing {levels.length} levels</>}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
              <Button
                variant={catalogType === 'courses' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setCatalogType('courses')}
              >
                Courses
              </Button>
              <Button
                variant={catalogType === 'levels' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setCatalogType('levels')}
              >
                Levels
              </Button>
            </div>
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
              <Grid className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <CourseFilter onFilterChange={setFilters} />
            </div>
          </aside>

          <main className="lg:col-span-3">
            {catalogType === 'courses' && filteredCourses.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 rounded-lg">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Courses Found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                <Button onClick={handleRefresh} className="mt-6">
                  Clear All Filters
                </Button>
              </div>
            ) : catalogType === 'courses' ? (
              <div
                className={`grid ${viewMode === "grid" ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}`}
              >
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} isListView={viewMode === "list"} />
                ))}
              </div>
            ) : (
              <div
                className={`grid ${viewMode === "grid" ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}`}
              >
                {levels.map((lvl) => (
                  <LevelCard key={lvl.id} level={lvl} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
