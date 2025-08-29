"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { ActionDropdown } from "@/components/ui/action-dropdown"
import { Protect, useAuth, useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function CoordinatorStudentsPage() {
  const router = useRouter()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ inserted:number, skipped:number, errors:{ line:number, error:string }[] } | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const reload = async () => {
    try {
      const res = await fetch(`/api/students`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load students')
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load students')
    }
  }

  useEffect(() => {
    if (!authLoaded || !orgLoaded) return
    if (!isSignedIn || !organization?.id) return
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const sres = await fetch('/api/me/school', { cache: 'no-store' })
        if (!sres.ok) throw new Error('Failed to resolve school')
        const school = await sres.json()
        const sid = school?.schoolId
        if (!sid) throw new Error('No school linked to this organization')
        if (!active) return
        setSchoolId(sid)
        setSchoolName(school?.name ?? null)

        const res = await fetch(`/api/students`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load students')
        const data = await res.json()
        if (!active) return
        setStudents(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (!active) return
        setError(e?.message || 'Failed to load students')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [authLoaded, orgLoaded, isSignedIn, organization?.id])

  const schoolDisplay = schoolName && schoolName !== 'Unnamed School' ? schoolName : (organization?.name || (schoolId ?? null))

  const onImport = async () => {
    if (!csvFile) return alert('Please select a CSV file');
    setImporting(true)
    setImportResult(null)
    setUploadProgress(0)
    try {
      const fd = new FormData()
      fd.append('file', csvFile)
      // Use XHR to get upload progress events
      const xhr = new XMLHttpRequest()
      const done: any = await new Promise((resolve, reject) => {
        xhr.open('POST', '/api/students/import')
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const p = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(p)
          }
        }
        xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText })
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.send(fd)
      })
      const data = (() => { try { return JSON.parse(done.body) } catch { return null } })()
      if (done.status < 200 || done.status >= 300) throw new Error(data?.error || 'Import failed')
      setImportResult({ inserted: data.inserted || 0, skipped: data.skipped || 0, errors: Array.isArray(data.errors) ? data.errors : [] })
      await reload()
      setCsvFile(null)
    } catch (e:any) {
      setImportResult({ inserted: 0, skipped: 0, errors: [{ line: 0, error: e?.message || 'Import failed' }] })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Protect
    role="schoolcoordinator"
    fallback={<p>Access denied</p>}
    >
    <RoleLayout title="Aiskool LMS" subtitle="Students" Sidebar={CoordinatorSidebar}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Students</h1>
        <div className="flex gap-2">
          <Link href="/coordinator/students/new"><Button>Add Student</Button></Link>
          <Link href="/api/students/import/template"><Button variant="outline">Download CSV template</Button></Link>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="block text-sm"
            />
            <Button onClick={onImport} disabled={importing || !csvFile}>{importing ? 'Importing...' : 'Import CSV'}</Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your School Students</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : error ? error : schoolDisplay ? `School: ${schoolDisplay}` : "No school linked"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {importResult && (
            <div className="mb-4 p-3 border rounded-md bg-gray-50">
              <div className="text-sm">Import summary: <strong>{importResult.inserted}</strong> inserted, <strong>{importResult.skipped}</strong> skipped.</div>
              {importResult.errors?.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium">Errors:</div>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {importResult.errors.map((e, idx) => (
                      <li key={idx}>Line {e.line}: {e.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {importing && (
            <div className="mb-4">
              <div className="text-sm mb-1">Uploading: {uploadProgress}%</div>
              <div className="h-2 w-full bg-gray-200 rounded">
                <div className="h-2 bg-blue-600 rounded" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 && (
                    <tr><td className="py-3 px-4 text-sm text-muted-foreground" colSpan={5}>No students found</td></tr>
                  )}
                  {students.map((s, idx) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium">{`${s.first_name || ""} ${s.last_name || ""}`.trim() || s.email || s.id}</td>
                      <td className="py-3 px-4">{s.email || "—"}</td>
                      <td className="py-3 px-4">{s.phone ? String(s.phone) : "—"}</td>
                      <td className="py-3 px-4 text-right">
                        <ActionDropdown
                          onView={() => router.push(`/coordinator/students/${s.id}`)}
                          onEdit={() => router.push(`/coordinator/students/${s.id}/edit`)}
                          onDelete={async () => {
                            const ok = confirm('Delete this student?')
                            if (!ok) return
                            const res = await fetch(`/api/students?id=${encodeURIComponent(s.id)}`, { method: 'DELETE' })
                            if (res.ok) {
                              reload()
                            } else {
                              const j = await res.json().catch(() => ({} as any))
                              alert(j?.error || 'Failed to delete')
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </RoleLayout>
    </Protect>
  )
}
