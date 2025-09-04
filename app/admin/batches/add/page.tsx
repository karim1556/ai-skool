"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Users, CheckCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Protect } from "@clerk/nextjs"

export default function AddBatchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [schoolId, setSchoolId] = useState<string>("")
  const [courseId, setCourseId] = useState<string>("")
  const [status, setStatus] = useState<string>("verified")
  const [maxStudents, setMaxStudents] = useState<string>("30")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [schedule, setSchedule] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([])
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])
  const [trainers, setTrainers] = useState<Array<{ id: string; first_name?: string; last_name?: string }>>([])
  const [students, setStudents] = useState<Array<{ id: string; first_name?: string; last_name?: string }>>([])
  const [selectedTrainerIds, setSelectedTrainerIds] = useState<Set<string>>(new Set())
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const load = async () => {
      try {
        const [schRes, crsRes, stdRes] = await Promise.all([
          fetch("/api/schools"),
          fetch("/api/courses"),
          fetch("/api/students"),
        ])
        const [sch, crs, std] = await Promise.all([schRes.json(), crsRes.json(), stdRes.json()])
        setSchools(Array.isArray(sch) ? sch : [])
        setCourses(Array.isArray(crs) ? crs : [])
        setStudents(Array.isArray(std) ? std : [])
      } catch (_) {}
    }
    load()
  }, [])

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const url = schoolId ? `/api/trainers?schoolId=${schoolId}` : "/api/trainers"
        const res = await fetch(url)
        const data = await res.json()
        setTrainers(Array.isArray(data) ? data : [])
      } catch (_) {}
    }
    loadTrainers()
  }, [schoolId])

  const steps = [
    { id: "basic", title: "Basic info", icon: User },
    { id: "students", title: "Students", icon: Users },
    { id: "finish", title: "Finish", icon: CheckCircle },
  ]

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="batchName">
          Batch Name<span className="text-red-500">*</span>
        </Label>
        <Input id="batchName" placeholder="Enter batch name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">School (optional)</Label>
        <Select value={schoolId} onValueChange={setSchoolId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose School" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">Course (optional)</Label>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>
          Status<span className="text-red-500">*</span>
        </Label>
        <RadioGroup value={status} onValueChange={setStatus} className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="verified" id="verified" />
            <Label htmlFor="verified">Verified</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unverified" id="unverified" />
            <Label htmlFor="unverified">Unverified</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trainers">Assign Trainers (multi-select)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {trainers.map((t) => {
            const id = t.id
            const label = `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim() || id
            const checked = selectedTrainerIds.has(id)
            return (
              <label key={id} className="flex items-center gap-2 rounded border p-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    setSelectedTrainerIds((prev) => {
                      const next = new Set(prev)
                      if (v) next.add(id)
                      else next.delete(id)
                      return next
                    })
                  }}
                />
                <span className="text-sm">{label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>,

    // Students Step
    <div key="students" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="maxStudents">Maximum Students</Label>
        <Input id="maxStudents" type="number" placeholder="Enter maximum number of students" value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Schedule</Label>
        <Input id="schedule" placeholder="Enter batch schedule (e.g., Mon-Fri 10:00-12:00)" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Enter batch description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Assign Students (multi-select; global)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {students.map((s) => {
            const id = s.id
            const label = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() || id
            const checked = selectedStudentIds.has(id)
            return (
              <label key={id} className="flex items-center gap-2 rounded border p-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    setSelectedStudentIds((prev) => {
                      const next = new Set(prev)
                      if (v) next.add(id)
                      else next.delete(id)
                      return next
                    })
                  }}
                />
                <span className="text-sm">{label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>,

    // Finish Step
    <div key="finish" className="space-y-6 text-center">
      <div className="space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">Review Your Information</h3>
        <p className="text-gray-600">Please review all the information you have entered before submitting.</p>
      </div>
    </div>,
  ]

  const handleComplete = async () => {
    try {
      if (!name) {
        toast({ title: "Batch name required", variant: "destructive" })
        return
      }
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          school_id: schoolId || null,
          course_id: courseId || null,
          start_date: startDate || null,
          end_date: endDate || null,
          max_students: maxStudents || null,
          status,
          schedule,
          description,
          trainerIds: Array.from(selectedTrainerIds),
          studentIds: Array.from(selectedStudentIds),
        }),
      })
      let data: any = null
      try {
        data = await res.json()
      } catch (_) {
        // non-JSON
      }
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => "Failed to create batch"))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      toast({ title: "Batch created" })
      router.push("/admin/batches")
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || String(e) || "Failed to create batch", variant: "destructive" })
    }
  }

  return (
    <Protect
    role="admin"
    fallback={<p>Access denied</p>}
    >
    <AdminLayout>
      <MultiStepForm steps={steps} onComplete={handleComplete}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
    </Protect>
  )
}

