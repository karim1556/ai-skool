import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EnrolStudentPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Enrol a student</h1>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>ENROLMENT FORM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user">
                  User<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">John Doe</SelectItem>
                    <SelectItem value="user2">Jane Smith</SelectItem>
                    <SelectItem value="user3">Mike Johnson</SelectItem>
                    <SelectItem value="user4">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">
                  Course to enrol<span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course1">Web Development Fundamentals</SelectItem>
                    <SelectItem value="course2">Data Science with Python</SelectItem>
                    <SelectItem value="course3">Digital Marketing Essentials</SelectItem>
                    <SelectItem value="course4">JavaScript Advanced Concepts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">Enrol student</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
