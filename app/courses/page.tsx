// "use client"

// // CourseFilter removed per request (sidebar removed)
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Grid, List, RefreshCw, Clock, Star, BookOpen, ShoppingCart, Search } from "lucide-react"
// import Image from "next/image"
// import { useState, useMemo, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { useCart } from "@/hooks/use-cart"

// export default function CoursesPage() {
//   const router = useRouter()
//   const [allCourses, setAllCourses] = useState<any[]>([])
//   const [levels, setLevels] = useState<any[]>([])
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [catalogType, setCatalogType] = useState<"courses" | "levels">("courses")
//   const [filters, setFilters] = useState({
//     category: "All category",
//     price: "All",
//     level: "All",
//     levelId: "All" as string | "All",
//     language: "All",
//     rating: "All",
//   })
//   const { addItem } = useCart()

//   useEffect(() => {
//     const fetchCourses = async () => {
//       // If a specific level is selected, fetch courses by level
//       if (filters.levelId && filters.levelId !== 'All') {
//         const res = await fetch(`/api/levels/${filters.levelId}/courses`)
//         const data = await res.json()
//         setAllCourses(Array.isArray(data) ? data : [])
//       } else {
//         const res = await fetch("/api/courses")
//         const data = await res.json()
//         setAllCourses(Array.isArray(data) ? data : [])
//       }
//     }
//     if (catalogType === 'courses') fetchCourses()
//   }, [filters.levelId, catalogType])

//   // Fetch levels when in Levels mode
//   useEffect(() => {
//     const fetchLevels = async () => {
//       const res = await fetch('/api/levels', { cache: 'no-store' })
//       const data = await res.json()
//       setLevels(Array.isArray(data) ? data : [])
//     }
//     if (catalogType === 'levels') fetchLevels()
//   }, [catalogType])

//   const filteredCourses = useMemo(() => {
//     return allCourses.filter((course) => {
//       if (filters.category !== "All category" && course.category !== filters.category) return false
//       if (filters.price === "Free" && !course.is_free) return false
//       if (filters.price === "Paid" && course.is_free) return false
//       // When fetching by levelId we already filtered, otherwise allow optional text-level filter
//       if ((!filters.levelId || filters.levelId === 'All') && filters.level !== "All" && course.level !== filters.level) return false
//       if (filters.language !== "All" && course.language !== filters.language) return false
//       if (filters.rating !== "All" && course.rating < Number.parseInt(filters.rating)) return false
//       return true
//     })
//   }, [filters, allCourses])

//   const handleEnrollNow = (e: React.MouseEvent, course: any) => {
//     e.preventDefault()
//     addItem({
//       id: course.id,
//       title: course.title,
//       price: Number(course.price || 0),
//       originalPrice: Number(course.original_price || 0) || undefined,
//       image: course.image || null,
//       provider: course.provider || null,
//       type: "course",
//     })
//     router.push("/cart")
//   }

//   const handleAddToCart = (e: React.MouseEvent, course: any) => {
//     e.preventDefault()
//     addItem({
//       id: course.id,
//       title: course.title,
//       price: Number(course.price || 0),
//       originalPrice: Number(course.original_price || 0) || undefined,
//       image: course.image || null,
//       provider: course.provider || null,
//       type: "course",
//     })
//   }

//   const handleRefresh = () => {
//     setFilters({
//       category: "All category",
//       price: "All",
//       level: "All",
//       levelId: "All",
//       language: "All",
//       rating: "All",
//     })
//   }

//   const CourseCard = ({ course, isListView }: { course: any; isListView: boolean }) => {
//     const numericRating = typeof course.rating === 'string' ? parseFloat(course.rating) : (course.rating || 0);

//     return (
//       <Link href={`/courses/${course.id}`} passHref>
//                 <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
//           <div className={isListView ? "flex flex-col md:flex-row" : "flex flex-col"}>
//             <Image
//               src={course.image || "/placeholder.svg"}
//               alt={course.title}
//               width={isListView ? 200 : 400}
//               height={isListView ? 120 : 225}
//               className={`object-cover ${isListView ? "md:w-1/3 rounded-l-lg" : "w-full h-48 rounded-t-lg"}`}
//             />
//             <div className="p-5 flex flex-col flex-grow">
//               <div className="flex-grow">
//                 <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{course.title}</h3>
//                 <p className="text-sm text-gray-500 mb-3">By {course.provider}</p>
//                 {isListView && <p className="text-sm text-gray-600 mb-4 hidden md:block">{course.description}</p>}
//                 <div className="flex items-center gap-1 mb-3">
//                   <span className="text-sm font-semibold text-yellow-500 mr-1">{numericRating.toFixed(1)}</span>
//                   {Array.from({ length: 5 }, (_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-4 w-4 ${i < Math.round(numericRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//                     />
//                   ))}
//                   <span className="text-xs text-gray-500 ml-1">({course.reviews} reviews)</span>
//                 </div>
//                 <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
//                   <div className="flex items-center gap-1.5">
//                     <BookOpen className="h-3.5 w-3.5" />
//                     <span>{course.lessons} Lessons</span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Clock className="h-3.5 w-3.5" />
//                     <span>{course.duration} Hours</span>
//                   </div>
//                   <Badge variant="outline" className="py-0.5 px-2 text-xs">{course.level}</Badge>
//                   {course.language && <Badge variant="outline" className="py-0.5 px-2 text-xs">{course.language}</Badge>}
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
//                 <div>
//                   {course.is_free ? (
//                     <span className="text-2xl font-bold text-green-600">Free</span>
//                   ) : (
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-2xl font-bold text-pink-600">₹{course.price}</span>
//                       {course.original_price && (
//                         <span className="text-md text-gray-400 line-through">₹{course.original_price}</span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button variant="outline" size="icon" onClick={(e) => handleAddToCart(e, course)}>
//                     <ShoppingCart className="h-4 w-4" />
//                   </Button>
//                   <Button size="sm" onClick={(e) => handleEnrollNow(e, course)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
//                     Enroll Now
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </Link>
//     );
//   }

//   const LevelCard = ({ level }: { level: any }) => {
//     const onAddToCart = (e: React.MouseEvent) => {
//       e.preventDefault()
//       addItem({
//         id: level.id,
//         title: level.name,
//         price: Number(level.price || 0),
//         originalPrice: Number(level.original_price || 0) || undefined,
//         image: level.thumbnail || null,
//         provider: null,
//         type: "level",
//       })
//     }
//     const onView = (e: React.MouseEvent) => {
//       // allow navigation
//       e.stopPropagation()
//     }
//     const hasDiscount = typeof level.original_price === 'number' && typeof level.price === 'number' && level.original_price > level.price
//     return (
//       <Link href={`/levels/${level.id}`}>
//         <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
//           <div className="w-full h-48 bg-gray-100">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             {level.thumbnail ? (
//               <img src={level.thumbnail} alt={level.name} className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No thumbnail</div>
//             )}
//           </div>
//           <div className="p-5 flex flex-col flex-grow">
//             <div className="flex items-center justify-between mb-1">
//               <h3 className="text-lg font-bold text-gray-900">{level.name}</h3>
//               {level.category && <Badge variant="secondary">{level.category}</Badge>}
//             </div>
//             {level.description && (
//               <p className="text-sm text-gray-600 mb-4 line-clamp-2">{level.description}</p>
//             )}
//             <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
//               <div>
//                 {level.is_free ? (
//                   <span className="text-xl font-bold text-green-600">Free</span>
//                 ) : (
//                   <div className="flex items-baseline gap-2">
//                     {typeof level.price === 'number' && (
//                       <span className="text-xl font-bold text-pink-600">₹{level.price}</span>
//                     )}
//                     {hasDiscount && (
//                       <span className="text-sm text-gray-400 line-through">₹{level.original_price}</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="icon" onClick={onAddToCart}>
//                   <ShoppingCart className="h-4 w-4" />
//                 </Button>
//                 <Button size="sm" onClick={onView} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
//                   View Courses
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </Link>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8">
//         <header className="mb-8">
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
//             {catalogType === 'courses' ? 'Our Courses' : 'Our Levels'}
//           </h1>
//           <p className="mt-2 text-lg text-gray-600">
//             {catalogType === 'courses'
//               ? 'Explore our wide range of courses and find the perfect one for you.'
//               : 'Browse levels and discover grouped courses by difficulty.'}
//           </p>
//         </header>

//         <div className="flex justify-between items-center mb-6">
//           <p className="text-sm text-gray-600 font-medium">
//             {catalogType === 'courses'
//               ? <>Showing {filteredCourses.length} of {allCourses.length} courses</>
//               : <>Showing {levels.length} levels</>}
//           </p>
//           <div className="flex items-center gap-2">
//             <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
//               <Button
//                 variant={catalogType === 'courses' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setCatalogType('courses')}
//               >
//                 Courses
//               </Button>
//               <Button
//                 variant={catalogType === 'levels' ? 'secondary' : 'ghost'}
//                 size="sm"
//                 onClick={() => setCatalogType('levels')}
//               >
//                 Levels
//               </Button>
//             </div>
//             <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
//               <Grid className="h-5 w-5" />
//             </Button>
//             <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
//               <List className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon" onClick={handleRefresh}>
//               <RefreshCw className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-8">
//           <main>
//             {catalogType === 'courses' && filteredCourses.length === 0 ? (
//               <div className="text-center py-24 bg-gray-50 rounded-lg">
//                 <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900">No Courses Found</h3>
//                 <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
//                 <Button onClick={handleRefresh} className="mt-6">
//                   Clear All Filters
//                 </Button>
//               </div>
//             ) : catalogType === 'courses' ? (
//               <div
//                 className={`grid ${viewMode === "grid" ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}`}
//               >
//                 {filteredCourses.map((course) => (
//                   <CourseCard key={course.id} course={course} isListView={viewMode === "list"} />
//                 ))}
//               </div>
//             ) : (
//               <div
//                 className={`grid ${viewMode === "grid" ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}`}
//               >
//                 {levels.map((lvl) => (
//                   <LevelCard key={lvl.id} level={lvl} />
//                 ))}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

// CourseFilter removed per request (sidebar removed)
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid, List, RefreshCw, Clock, Star, BookOpen, ShoppingCart, Search, Filter } from "lucide-react"
import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

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
  const { addItem } = useCart()

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

  const handleEnrollNow = (e: React.MouseEvent, course: any) => {
    e.preventDefault()
    addItem({
      id: course.id,
      title: course.title,
      price: Number(course.price || 0),
      originalPrice: Number(course.original_price || 0) || undefined,
      image: course.image || null,
      provider: course.provider || null,
      type: "course",
    })
    router.push("/cart")
  }

  const handleAddToCart = (e: React.MouseEvent, course: any) => {
    e.preventDefault()
    addItem({
      id: course.id,
      title: course.title,
      price: Number(course.price || 0),
      originalPrice: Number(course.original_price || 0) || undefined,
      image: course.image || null,
      provider: course.provider || null,
      type: "course",
    })
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
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200/80 hover:border-purple-200 h-full flex flex-col bg-white/50 backdrop-blur-sm">
          <div className={isListView ? "flex flex-col md:flex-row" : "flex flex-col"}>
            <div className={`relative ${isListView ? "md:w-1/3" : "w-full"}`}>
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                width={isListView ? 200 : 400}
                height={isListView ? 120 : 225}
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  isListView ? "md:w-full h-32 md:h-full rounded-l-lg" : "w-full h-48 rounded-t-lg"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 border-0 font-semibold px-2 py-1">
                {course.level}
              </Badge>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {course.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 font-medium">By {course.provider}</p>
                
                {isListView && (
                  <p className="text-sm text-gray-600 mb-4 hidden md:block line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                )}
                
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-yellow-600">{numericRating.toFixed(1)}</span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(numericRating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">({course.reviews} reviews)</span>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{course.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{course.duration} Hours</span>
                  </div>
                  {course.language && (
                    <Badge variant="secondary" className="rounded-full px-3 py-1.5 bg-blue-50 text-blue-700 border-0">
                      {course.language}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div>
                  {course.is_free ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">Free</span>
                      <Badge className="bg-green-100 text-green-800 border-0">FREE</Badge>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-pink-600">₹{course.price}</span>
                      {course.original_price && course.original_price > course.price && (
                        <span className="text-lg text-gray-400 line-through">₹{course.original_price}</span>
                      )}
                      {course.original_price && course.original_price > course.price && (
                        <Badge className="bg-red-100 text-red-800 border-0 ml-1">
                          Save ₹{course.original_price - course.price}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={(e) => handleAddToCart(e, course)}
                    className="rounded-full border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => handleEnrollNow(e, course)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
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
      addItem({
        id: level.id,
        title: level.name,
        price: Number(level.price || 0),
        originalPrice: Number(level.original_price || 0) || undefined,
        image: level.thumbnail || null,
        provider: null,
        type: "level",
      })
    }
    const onView = (e: React.MouseEvent) => {
      // allow navigation
      e.stopPropagation()
    }
    const hasDiscount = typeof level.original_price === 'number' && typeof level.price === 'number' && level.original_price > level.price
    
    return (
      <Link href={`/levels/${level.id}`}>
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200/80 hover:border-blue-200 h-full flex flex-col bg-white/50 backdrop-blur-sm">
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {level.thumbnail ? (
              <Image
                src={level.thumbnail}
                alt={level.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No thumbnail</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 border-0 font-semibold px-3 py-1.5">
              Level
            </Badge>
          </div>
          
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                {level.name}
              </h3>
              {level.category && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-0 rounded-full">
                  {level.category}
                </Badge>
              )}
            </div>
            
            {level.description && (
              <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                {level.description}
              </p>
            )}
            
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                {level.is_free ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">Free</span>
                    <Badge className="bg-green-100 text-green-800 border-0">FREE</Badge>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-3">
                    {typeof level.price === 'number' && (
                      <span className="text-2xl font-bold text-pink-600">₹{level.price}</span>
                    )}
                    {hasDiscount && (
                      <>
                        <span className="text-lg text-gray-400 line-through">₹{level.original_price}</span>
                        <Badge className="bg-red-100 text-red-800 border-0">
                          Save ₹{level.original_price - level.price}
                        </Badge>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onAddToCart}
                  className="rounded-full border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={onView}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                >
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8">
        {/* Enhanced Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-6">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-700">
              {catalogType === 'courses' ? 'Browse Our Courses' : 'Explore Learning Levels'}
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {catalogType === 'courses' ? 'Discover Courses' : 'Learning Paths'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {catalogType === 'courses'
              ? 'Master new skills with our expertly crafted courses. Start your learning journey today.'
              : 'Follow structured learning paths designed to take you from beginner to expert.'}
          </p>
        </header>

        {/* Enhanced Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <Button
                  variant={catalogType === 'courses' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCatalogType('courses')}
                  className={`rounded-full px-6 font-semibold transition-all ${
                    catalogType === 'courses' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Courses
                </Button>
                <Button
                  variant={catalogType === 'levels' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCatalogType('levels')}
                  className={`rounded-full px-6 font-semibold transition-all ${
                    catalogType === 'levels' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Levels
                </Button>
              </div>
              
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="icon" 
                  onClick={() => setViewMode("grid")}
                  className={`rounded-full transition-all ${
                    viewMode === "grid" ? 'bg-white shadow-md' : 'text-gray-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="icon" 
                  onClick={() => setViewMode("list")}
                  className={`rounded-full transition-all ${
                    viewMode === "list" ? 'bg-white shadow-md' : 'text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600 font-medium bg-gray-50 rounded-full px-4 py-2">
                <span className="text-purple-600 font-bold">
                  {catalogType === 'courses' ? filteredCourses.length : levels.length}
                </span>{" "}
                {catalogType === 'courses' ? 'courses available' : 'levels found'}
              </p>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh}
                className="rounded-full border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                title="Refresh filters"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <main>
          {catalogType === 'courses' && filteredCourses.length === 0 ? (
            <div className="text-center py-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Courses Found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                We couldn't find any courses matching your criteria. Try adjusting your filters or browse all courses.
              </p>
              <Button 
                onClick={handleRefresh} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full px-8 shadow-lg"
              >
                Clear All Filters
              </Button>
            </div>
          ) : catalogType === 'courses' ? (
            <div
              className={`grid ${
                viewMode === "grid" 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' 
                  : 'space-y-6'
              }`}
            >
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} isListView={viewMode === "list"} />
              ))}
            </div>
          ) : (
            <div
              className={`grid ${
                viewMode === "grid" 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' 
                  : 'space-y-6'
              }`}
            >
              {levels.map((lvl) => (
                <LevelCard key={lvl.id} level={lvl} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}