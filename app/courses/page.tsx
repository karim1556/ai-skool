"use client"

import { CourseFilter } from "@/components/course-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid, List, RefreshCw, Clock, Star, BookOpen, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CoursesPage() {
  const router = useRouter()
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    category: "All category",
    price: "All",
    level: "All",
    language: "All",
    rating: "All",
  })
  const [cartItems, setCartItems] = useState<number[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/courses")
      const data = await res.json()
      setAllCourses(data)
    }
    fetchCourses()
  }, [])

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (filters.category !== "All category" && course.category !== filters.category) return false
      if (filters.price === "Free" && !course.is_free) return false
      if (filters.price === "Paid" && course.is_free) return false
      if (filters.level !== "All" && course.level !== filters.level) return false
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
      language: "All",
      rating: "All",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-800 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm">
            <span className="text-gray-300">Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-300">Courses</span>
            <span className="mx-2">/</span>
            <span>All category</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-blue-600 font-medium">Showing on this page: {filteredCourses.length}</p>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1">
            <CourseFilter onFilterChange={setFilters} />
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No results found</p>
                <Button onClick={handleRefresh} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                {filteredCourses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`} passHref>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-0">
                        <div
                          className={
                            viewMode === "grid"
                              ? "p-6 space-y-4 flex flex-col"
                              : "grid grid-cols-1 md:grid-cols-3 gap-6 p-6"
                          }
                        >
                          <div className={viewMode === "grid" ? "" : "md:col-span-1"}>
                            <Image
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              width={300}
                              height={200}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                          <div
                            className={
                              viewMode === "grid"
                                ? "space-y-4 flex flex-col flex-grow"
                                : "md:col-span-2 space-y-4 flex flex-col"
                            }
                          >
                            <div className="flex-grow">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                              <p className="text-sm text-blue-600 font-medium">{course.provider}</p>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed flex-grow">{course.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{course.lessons} Lessons</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{course.duration} Hours</span>
                              </div>
                              <Badge variant="secondary">{course.language}</Badge>
                              <Badge variant="outline">{course.level}</Badge>
                              {course.is_free && <Badge className="bg-green-100 text-green-800">Free</Badge>}
                            </div>

                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < course.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">{course.reviews} Reviews</span>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-2">
                                {course.is_free ? (
                                  <span className="text-2xl font-bold text-green-600">Free</span>
                                ) : (
                                  <>
                                    <span className="text-2xl font-bold text-pink-600">₹{course.price}</span>
                                    {course.original_price && (
                                      <span className="text-sm text-gray-500 line-through">
                                        ₹{course.original_price}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => handleAddToCart(e, course.id)}
                                  disabled={cartItems.includes(course.id)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  {cartItems.includes(course.id) ? "Added" : "Add to Cart"}
                                </Button>
                                <Button
                                  className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700"
                                  onClick={(e) => handleEnrollNow(e, course.id)}
                                >
                                  Enroll Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
