"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CourseContentManager } from "@/components/courses/course-content-manager"
import { CourseDetailsEditor } from "@/components/courses/course-details-editor"
import { CourseReviewsManager } from "@/components/courses/course-reviews-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Protect } from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Settings, Star, AlertCircle, CheckCircle2 } from "lucide-react"

// Define types for the data we'll be fetching
interface BasicCourse {
  id: string;
  title: string;
}

interface Review {
  id: string;
  user: string;
  user_image: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface CourseDetails {
  id: string;
  title: string;
  curriculum: any[];
  objectives: string[];
  reviews: Review[];
  // Add other properties as needed from your details API
}

export default function ManageCourseContentPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([]) 
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch the list of basic courses for the dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [coursesRes, instructorsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/instructors')
        ]);

        if (!coursesRes.ok) throw new Error('Failed to fetch courses');
        if (!instructorsRes.ok) throw new Error('Failed to fetch instructors');

        const coursesData = await coursesRes.json();
        const instructorsData = await instructorsRes.json();

        setCourses(coursesData);
        setInstructors(instructorsData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  // Handle course selection and fetch its details
  const handleCourseSelect = async (courseId: string) => {
    if (!courseId) {
      setSelectedCourse(null)
      return
    }

    try {
      setFetchingDetails(true)
      setError(null)
      setSuccess(null)
      const res = await fetch(`/api/courses/${courseId}/details`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || "Failed to fetch course details.");
      }
      setSelectedCourse(data)
      setSuccess("Course loaded successfully!")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error fetching course details:", error)
      setError(error.message)
      setSelectedCourse(null)
    } finally {
      setFetchingDetails(false)
    }
  }

  // Clear messages when component unmounts or course changes
  useEffect(() => {
    return () => {
      setError(null)
      setSuccess(null)
    }
  }, [selectedCourse?.id])

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                Manage Course Content
              </h1>
              <p className="text-gray-500 mt-2">
                Select a course to manage its detailed content, including sections, lessons, instructors, and reviews.
              </p>
            </div>
            {selectedCourse && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {courses.length} courses available
              </Badge>
            )}
          </div>

          {/* Status Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Course Selection Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-blue-600" />
                Course Selection
              </CardTitle>
              <CardDescription>
                Choose a course from the list to start editing its content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full max-w-md" />
                </div>
              ) : (
                <div className="max-w-md space-y-2">
                  <Label htmlFor="course-select" className="text-sm font-medium">
                    Select Course
                  </Label>
                  <Select onValueChange={handleCourseSelect} value={selectedCourse?.id || ""}>
                    <SelectTrigger id="course-select" className="w-full">
                      <SelectValue placeholder="Choose a course to edit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {courses.length} courses available for editing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading State for Course Details */}
          {fetchingDetails && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Management Tabs */}
          {selectedCourse && !fetchingDetails && !error && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-xl">
                    {selectedCourse.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>
                      {selectedCourse.reviews?.length || 0} reviews
                    </span>
                    <span>•</span>
                    <span>
                      {selectedCourse.curriculum?.length || 0} curriculum items
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 p-2">
                    <TabsTrigger value="details" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="curriculum" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Curriculum
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="p-6">
                    <CourseDetailsEditor course={selectedCourse} />
                  </TabsContent>
                  
                  <TabsContent value="curriculum" className="p-6">
                    <CourseContentManager 
                      course={selectedCourse} 
                      instructors={instructors} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="p-6">
                    <CourseReviewsManager 
                      reviews={selectedCourse.reviews || []} 
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!selectedCourse && !loading && !fetchingDetails && !error && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Course Selected
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Select a course from the dropdown above to start managing its content, 
                  curriculum, and reviews.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    </Protect>
  )
}