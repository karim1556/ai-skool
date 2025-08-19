"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function EnrolStudentPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [students, setStudents] = useState<Array<{ id: string; first_name?: string; last_name?: string; email?: string }>>([])
  const [courses, setCourses] = useState<Array<{ id: string; title?: string }>>([])
  const [studentId, setStudentId] = useState<string>("")
  const [courseId, setCourseId] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/courses'),
        ])
        const [sRows, cRows] = await Promise.all([sRes.json(), cRes.json()])
        setStudents(Array.isArray(sRows) ? sRows : [])
        setCourses(Array.isArray(cRows) ? cRows : [])
      } catch (_) {}
    }
    load()
  }, [])

  const handleSubmit = async () => {
    try {
      if (!studentId || !courseId) {
        toast({ title: 'Select student and course', variant: 'destructive' })
        return
      }
      const res = await fetch('/api/enrolments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, course_id: courseId }),
      })
      let data: any = null
      try { data = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => 'Failed to enrol'))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      toast({ title: 'Student enrolled to course' })
      router.push('/admin/enrolment/history')
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || String(e), variant: 'destructive' })
    }
  }

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
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(s => {
                      const label = `${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || s.email || s.id
                      return <SelectItem key={s.id} value={s.id}>{label}</SelectItem>
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">
                  Course to enrol<span className="text-red-500">*</span>
                </Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title || c.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Enrol student</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
