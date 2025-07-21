import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockCourses } from "@/lib/mock-data"

interface CourseListProps {
  role: string
  privileges: string[]
}

export function CourseList({ role, privileges }: CourseListProps) {
  const [courses, setCourses] = useState(mockCourses)

  const canAdd = privileges.includes("manage_courses") || role === "admin"
  const canEdit = privileges.includes("manage_courses") || role === "admin"
  const canDelete = privileges.includes("manage_courses") || role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        {canAdd && <Button>Add New Course</Button>}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>{course.instructor}</span>
                <div className="flex gap-2">
                  {canEdit && <Button size="sm" variant="outline">Edit</Button>}
                  {canDelete && <Button size="sm" variant="destructive">Delete</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 