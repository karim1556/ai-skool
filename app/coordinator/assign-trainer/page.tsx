"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

export default function AssignTrainerPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([])
  const [schoolId, setSchoolId] = useState<string>("")

  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([])
  const [batchId, setBatchId] = useState<string>("")

  const [trainers, setTrainers] = useState<Array<{ id: string; first_name?: string; last_name?: string }>>([])
  const [selectedTrainerIds, setSelectedTrainerIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const res = await fetch("/api/schools")
        const data = await res.json()
        setSchools(Array.isArray(data) ? data : [])
      } catch (_) {}
    }
    loadSchools()
  }, [])

  useEffect(() => {
    const loadBatchesAndTrainers = async () => {
      setBatches([])
      setTrainers([])
      setBatchId("")
      setSelectedTrainerIds(new Set())
      try {
        if (schoolId) {
          const [bRes, tRes] = await Promise.all([
            fetch(`/api/batches?schoolId=${schoolId}`),
            fetch(`/api/trainers?schoolId=${schoolId}`),
          ])
          const [bData, tData] = await Promise.all([bRes.json(), tRes.json()])
          setBatches(Array.isArray(bData) ? bData : [])
          setTrainers(Array.isArray(tData) ? tData : [])
        } else {
          const [bRes, tRes] = await Promise.all([
            fetch(`/api/batches`),
            fetch(`/api/trainers`),
          ])
          const [bData, tData] = await Promise.all([bRes.json(), tRes.json()])
          setBatches(Array.isArray(bData) ? bData : [])
          setTrainers(Array.isArray(tData) ? tData : [])
        }
      } catch (_) {}
    }
    loadBatchesAndTrainers()
  }, [schoolId])

  const canSubmit = useMemo(() => !!batchId && selectedTrainerIds.size > 0, [batchId, selectedTrainerIds])

  const onAssign = async () => {
    try {
      if (!batchId) {
        toast({ title: "Select a batch", variant: "destructive" })
        return
      }
      const res = await fetch(`/api/batches?id=${batchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainerIds: Array.from(selectedTrainerIds) }),
      })
      let data: any = null
      try { data = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => "Failed to assign trainer(s)"))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      toast({ title: "Trainer(s) assigned" })
      router.push("/coordinator/dashboard")
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || String(e) || "Failed to assign trainer(s)", variant: "destructive" })
    }
  }

  return (
    <Protect
    role="schoolcoordinator"
    fallback={<p>Access denied</p>}
    >
    <RoleLayout title="Coordinator" subtitle="Assign Trainer to Batch" Sidebar={CoordinatorSidebar}>
      <div className="max-w-3xl space-y-6">
        <Card className="p-4 space-y-4">
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
            <Label htmlFor="batch">Batch</Label>
            <Select value={batchId} onValueChange={setBatchId}>
              <SelectTrigger>
                <SelectValue placeholder={batches.length ? "Choose Batch" : "No batches"} />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assign Trainers</Label>
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
          <div className="pt-2">
            <Button onClick={onAssign} disabled={!canSubmit}>Assign</Button>
          </div>
        </Card>
      </div>
    </RoleLayout>
    </Protect>
  )
}
