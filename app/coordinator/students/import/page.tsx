"use client"

import { useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth, useOrganization } from "@clerk/nextjs"

export default function ImportStudentsPage() {
  const { isSignedIn } = useAuth()
  const { organization } = useOrganization()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async () => {
    if (!isSignedIn || !organization?.id) { setError('Sign in and select org'); return }
    if (!file) { setError('Please select a CSV file'); return }
    setError(null); setResult(null); setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/students/import', { method: 'POST', body: fd })
      const js = await res.json()
      if (!res.ok) throw new Error(js?.error || 'Import failed')
      setResult(js)
    } catch (e:any) {
      setError(e?.message || 'Failed to import')
    } finally { setLoading(false) }
  }

  return (
    <RoleLayout title="Aiskool LMS" subtitle="Import Students" Sidebar={CoordinatorSidebar}>
      <Card>
        <CardHeader>
          <CardTitle>Import Students from CSV</CardTitle>
          <CardDescription>Headers: first_name, last_name, email, phone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input type="file" accept=".csv,text/csv" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
            <Button onClick={onSubmit} disabled={loading || !file}>{loading ? 'Importing...' : 'Import'}</Button>
            {error && <div className="text-sm text-destructive">{error}</div>}
            {result && (
              <div className="text-sm">
                <div>Inserted: <b>{result.inserted}</b></div>
                <div>Skipped: <b>{result.skipped}</b></div>
                {Array.isArray(result.errors) && result.errors.length>0 && (
                  <div className="mt-2">
                    <div className="font-medium">Errors</div>
                    <ul className="list-disc ml-5">
                      {result.errors.map((e:any, idx:number)=> (
                        <li key={idx}>Line {e.line}: {e.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </RoleLayout>
  )
}
