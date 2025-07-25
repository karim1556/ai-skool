"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseContentManager } from "@/components/courses/course-content-manager"

// Define types for the data we'll be fetching
interface BasicCourse {
  id: string;
  title: string;
}

interface CourseDetails {
  id: string;
  title: string;
  curriculum: any[]; // Using 'any' for now, will be typed in the component
  // Add other properties as needed from your details API
}

export default function ManageCourseContentPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([]) 
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch the list of basic courses for the dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
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
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/courses/${courseId}/details`)
      if (!res.ok) {
        throw new Error("Failed to fetch course details.")
      }
      const data = await res.json()
      setSelectedCourse(data)
    } catch (error: any) {
      console.error("Error fetching course details:", error)
      setError(error.message)
      setSelectedCourse(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">📝 Manage Course Content</h1>
        <p className="text-gray-500">Select a course to manage its detailed content, including sections, lessons, instructors, and more.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Select a Course</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading courses...</p>
            ) : (
              <div className="max-w-md">
                <Label htmlFor="course-select">Course</Label>
                <Select onValueChange={handleCourseSelect} value={selectedCourse?.id || ""}>
                  <SelectTrigger id="course-select">
                    <SelectValue placeholder="Select a course to edit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {loading && <p className="text-center mt-6">Loading course content...</p>}
        {error && <p className="text-center mt-6 text-red-500">Error: {error}</p>}

        {selectedCourse && !loading && !error && (
          <CourseContentManager course={selectedCourse} instructors={instructors} />
        )}
      </div>
    </AdminLayout>
  )
}
