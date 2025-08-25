"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { TrainerSidebar } from "@/components/layout/trainer-sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function SessionAttendancePage() {
  const params = useParams<{ id: string }>()
  const sessionId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      if (!sessionId) return
      setLoading(true); setError(null)
      try {
        const [sRes, aRes] = await Promise.all([
          fetch(`/api/sessions?id=${sessionId}`),
          fetch(`/api/session-attendance?sessionId=${sessionId}`)
        ])
        const [sjs, ajs] = await Promise.all([sRes.json(), aRes.json()])
        if (!active) return
        if (!sRes.ok) throw new Error(sjs?.error || 'Failed to load session')
        if (!aRes.ok) throw new Error(ajs?.error || 'Failed to load attendance')
        setSession((sjs || [])[0] || null)
        setRows(ajs || [])
      } catch (e:any) {
        if (!active) return
        setError(e?.message || 'Failed to load attendance')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [sessionId])

  const togglePresent = async (student_id:string, present:boolean) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/session-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, student_id, present })
      })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Failed to save')
      setRows((prev) => prev.map(r => r.student_id === student_id ? { ...r, present } : r))
    } catch (e:any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Session Attendance" Sidebar={TrainerSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
          <CardDescription>
            {session ? `${session.title || 'Untitled'} • ${session.session_date || ''} ${session.session_time || ''}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? 'Loading...' : error ? <div className="text-destructive">{error}</div> : (
            <div className="space-y-2">
              {rows.length === 0 && <div className="text-sm text-muted-foreground">No students found for this session.</div>}
              {rows.map((r:any) => (
                <div key={r.student_id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <div className="font-medium">{r.first_name || ''} {r.last_name || ''}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id={`cb-${r.student_id}`} checked={!!r.present} onCheckedChange={(v) => togglePresent(r.student_id, !!v)} />
                    <label htmlFor={`cb-${r.student_id}`}>Present</label>
                  </div>
                </div>
              ))}
              {saving && <div className="text-xs text-muted-foreground">Saving...</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
  )
}
