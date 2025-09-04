"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Protect } from "@clerk/nextjs"

export default function EnrolToBatchPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [students, setStudents] = useState<Array<{ id: string; first_name?: string; last_name?: string; email?: string }>>([])
  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([])
  const [studentId, setStudentId] = useState<string>("")
  const [batchId, setBatchId] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, bRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/batches'),
        ])
        const [sRows, bRows] = await Promise.all([sRes.json(), bRes.json()])
        setStudents(Array.isArray(sRows) ? sRows : [])
        setBatches(Array.isArray(bRows) ? bRows : [])
      } catch (_) {}
    }
    load()
  }, [])

  const handleSubmit = async () => {
    try {
      if (!studentId || !batchId) {
        toast({ title: 'Select student and batch', variant: 'destructive' })
        return
      }
      const res = await fetch('/api/batch-enrolments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, batch_id: batchId }),
      })
      let data: any = null
      try { data = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => 'Failed to enrol'))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      toast({ title: 'Student enrolled to batch' })
      router.push('/admin/enrolment/history')
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || String(e), variant: 'destructive' })
    }
  }

  return (
    <Protect
    role="admin"
    fallback={<p>Access denied</p>}
    >
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Enrol a student to batch</h1>
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
                <Label htmlFor="batch">
                  Batch to enrol<span className="text-red-500">*</span>
                </Label>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
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
    </Protect>
  )
}
