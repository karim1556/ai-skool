"use client"


import { CourseFilter } from "@/components/course-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid, List, RefreshCw, Clock, Star, BookOpen, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"

const allCourses = [
  {
    id: 1,
    title: "Kodable Basics",
    provider: "Kodable Education",
    description:
      "An early education program designed for children aged 4 to 8. It introduces foundational concepts of coding, logic, and problem-solving through screen-free play and interactive activities.",
    image: "/placeholder.svg?height=200&width=300",
    price: 2999,
    originalPrice: 3999,
    lessons: 15,
    duration: "8:30:45",
    language: "English",
    level: "Beginner",
    rating: 5,
    reviews: 12,
    category: "Coding Fundamentals",
    isFree: false,
  },
  {
    id: 2,
    title: "Kodable Creator",
    provider: "Kodable Education",
    description:
      "Advanced coding platform that empowers young learners to become creative problem-solvers by building their own games and interactive stories using visual programming.",
    image: "/placeholder.svg?height=200&width=300",
    price: 4999,
    originalPrice: 6999,
    lessons: 20,
    duration: "12:15:30",
    language: "English",
    level: "Intermediate",
    rating: 5,
    reviews: 8,
    category: "Game Design",
    isFree: false,
  },
  {
    id: 3,
    title: "Bug World Adventures",
    provider: "Kodable Education",
    description:
      "An engaging adventure game that teaches programming concepts through exploration and puzzle-solving in a colorful bug-themed world.",
    image: "/placeholder.svg?height=200&width=300",
    price: 0,
    originalPrice: 2999,
    lessons: 12,
    duration: "6:45:20",
    language: "English",
    level: "Beginner",
    rating: 4,
    reviews: 15,
    category: "Game Design",
    isFree: true,
  },
  {
    id: 4,
    title: "STEM Fundamentals",
    provider: "Kodable Education",
    description:
      "Comprehensive STEM education program covering science, technology, engineering, and mathematics through hands-on projects and interactive learning.",
    image: "/placeholder.svg?height=200&width=300",
    price: 5999,
    originalPrice: 7999,
    lessons: 25,
    duration: "15:30:00",
    language: "English",
    level: "Advanced",
    rating: 5,
    reviews: 20,
    category: "STEM Education",
    isFree: false,
  },
  {
    id: 5,
    title: "Game Design Workshop",
    provider: "Kodable Education",
    description:
      "Learn to design and create your own video games using real programming concepts in a fun and engaging environment.",
    image: "/placeholder.svg?height=200&width=300",
    price: 3999,
    originalPrice: 4999,
    lessons: 18,
    duration: "10:20:15",
    language: "Spanish",
    level: "Intermediate",
    rating: 4,
    reviews: 10,
    category: "Game Design",
    isFree: false,
  },
  {
    id: 6,
    title: "Robotics & AI",
    provider: "Kodable Education",
    description:
      "Introduction to robotics and artificial intelligence concepts through practical projects and interactive simulations.",
    image: "/placeholder.svg?height=200&width=300",
    price: 6999,
    originalPrice: 8999,
    lessons: 22,
    duration: "14:45:30",
    language: "English",
    level: "Advanced",
    rating: 5,
    reviews: 18,
    category: "Robotics",
    isFree: false,
  },
]

export default function CoursesPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    category: "All category",
    price: "All",
    level: "All",
    language: "All",
    rating: "All",
  })
  const [cartItems, setCartItems] = useState<number[]>([])

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (filters.category !== "All category" && course.category !== filters.category) return false
      if (filters.price === "Free" && !course.isFree) return false
      if (filters.price === "Paid" && course.isFree) return false
      if (filters.level !== "All" && course.level !== filters.level) return false
      if (filters.language !== "All" && course.language !== filters.language) return false
      if (filters.rating !== "All" && course.rating < Number.parseInt(filters.rating)) return false
      return true
    })
  }, [filters])

  const handleEnrollNow = (courseId: number) => {
    if (!cartItems.includes(courseId)) {
      setCartItems([...cartItems, courseId])
    }
    router.push("/cart")
  }

  const handleAddToCart = (courseId: number) => {
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
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div
                        className={viewMode === "grid" ? "p-6 space-y-4" : "grid grid-cols-1 md:grid-cols-3 gap-6 p-6"}
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
                        <div className={viewMode === "grid" ? "space-y-4" : "md:col-span-2 space-y-4"}>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h3>
                            <p className="text-sm text-blue-600 font-medium">{course.provider}</p>
                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>

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
                            {course.isFree && <Badge className="bg-green-100 text-green-800">Free</Badge>}
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

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {course.isFree ? (
                                <span className="text-2xl font-bold text-green-600">Free</span>
                              ) : (
                                <>
                                  <span className="text-2xl font-bold text-pink-600">₹{course.price}</span>
                                  {course.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">₹{course.originalPrice}</span>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddToCart(course.id)}
                                disabled={cartItems.includes(course.id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                {cartItems.includes(course.id) ? "Added" : "Add to Cart"}
                              </Button>
                              <Button
                                className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700"
                                onClick={() => handleEnrollNow(course.id)}
                              >
                                Enroll Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
