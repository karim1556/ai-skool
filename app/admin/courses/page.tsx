"use client"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CourseStats } from "@/components/courses/course-stats"
import { CourseFilters } from "@/components/courses/course-filters"
import { DataTable } from "@/components/ui/data-table"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data
const mockCourses = [
  {
    id: 1,
    title: "A-Tiny",
    instructor: "Aiskool Mumbai",
    category: "Beginner",
    sections: 3,
    lessons: 17,
    enrolled: 14,
    status: "Active",
    price: "Free",
  },
  {
    id: 2,
    title: "PROTON-BLOCKS",
    instructor: "Aiskool Mumbai",
    category: "Beginner",
    sections: 4,
    lessons: 14,
    enrolled: 21,
    status: "Active",
    price: "Free",
  },
  {
    id: 3,
    title: "SCRATCH-JUNIOR",
    instructor: "Aiskool Mumbai",
    category: "Beginner",
    sections: 4,
    lessons: 20,
    enrolled: 13,
    status: "Active",
    price: "Free",
  },
  {
    id: 4,
    title: "PROTON BLOCK PLUS",
    instructor: "Aiskool Mumbai",
    category: "Beginner",
    sections: 0,
    lessons: 0,
    enrolled: 4,
    status: "Active",
    price: "₹5600",
  },
]

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState(mockCourses)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    instructor: "all",
    price: "all",
  })

  // Calculate stats
  const stats = useMemo(
    () => ({
      active: courses.filter((c) => c.status.toLowerCase() === "active").length,
      pending: courses.filter((c) => c.status.toLowerCase() === "pending").length,
      free: courses.filter((c) => c.price === "Free").length,
      paid: courses.filter((c) => c.price !== "Free").length,
    }),
    [courses],
  )

  // Filter courses based on selected filters
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (filters.category !== "all" && course.category.toLowerCase() !== filters.category) return false
      if (filters.status !== "all" && course.status.toLowerCase() !== filters.status) return false
      if (filters.instructor !== "all" && course.instructor.toLowerCase().replace(/\s+/g, "-") !== filters.instructor)
        return false
      if (filters.price !== "all") {
        if (filters.price === "free" && course.price !== "Free") return false
        if (filters.price === "paid" && course.price === "Free") return false
      }
      return true
    })
  }, [courses, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleApplyFilters = () => {
    // Filters are applied automatically via useMemo
    console.log("Filters applied:", filters)
  }

  const handleAction = (action: string, course: any) => {
    switch (action) {
      case "view":
        window.open(`/courses/${course.id}`, "_blank")
        break
      case "edit":
        router.push(`/admin/courses/${course.id}/edit`)
        break
      case "sections":
        router.push(`/admin/courses/${course.id}/edit`)
        break
      case "pending":
        setCourses(courses.map((c) => (c.id === course.id ? { ...c, status: "Pending" } : c)))
        break
      case "delete":
        setCourses(courses.filter((c) => c.id !== course.id))
        break
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">📚 Courses</h1>
          <Button onClick={() => router.push("/admin/courses/add")} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add new course
          </Button>
        </div>

        <CourseStats stats={stats} />

        <CourseFilters filters={filters} onFilterChange={handleFilterChange} onApplyFilters={handleApplyFilters} />

        <DataTable data={filteredCourses} searchFields={["title", "instructor"]} title="Course Management">
          {(paginatedData) => (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">#</th>
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Lesson and section</th>
                    <th className="text-left p-4 font-medium">Enrolled student</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((course, index) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-blue-600">{course.title}</div>
                          <div className="text-sm text-gray-500">Instructor: {course.instructor}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{course.category}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>Total section: {course.sections}</div>
                          <div>Total lesson: {course.lessons}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">Total enrolment: {course.enrolled}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={course.status === "Active" ? "default" : "secondary"}>{course.status}</Badge>
                      </td>
                      <td className="p-4 font-medium">{course.price}</td>
                      <td className="p-4">
                        <ActionDropdown
                          actions={[
                            { label: "View course on frontend", value: "view" },
                            { label: "Edit this course", value: "edit" },
                            { label: "Section and lesson", value: "sections" },
                            { label: "Mark as pending", value: "pending" },
                            { label: "Delete", value: "delete", variant: "destructive" },
                          ]}
                          onAction={(action) => handleAction(action, course)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DataTable>
      </div>
    </AdminLayout>
  )
}
