"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { User, Lock, Share2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams() as { id?: string }
  const id = params?.id as string
  const { toast } = useToast()

  const steps = useMemo(() => ([
    { id: "basic", title: "Basic info", icon: User },
    { id: "credentials", title: "Login credentials", icon: Lock },
    { id: "social", title: "Social information", icon: Share2 },
    { id: "finish", title: "Finish", icon: CheckCircle },
  ]), [])

  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [biography, setBiography] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [parentPhone, setParentPhone] = useState("")
  const [address, setAddress] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/students?id=${id}`, { cache: "no-store" })
        const rows = await res.json()
        const s = Array.isArray(rows) ? rows[0] : rows
        if (s) {
          setFirstName(s.first_name || "")
          setLastName(s.last_name || "")
          setBiography(s.biography || "")
          setEmail(s.email || "")
          setPhone(s.phone || "")
          setParentPhone(s.parent_phone || "")
          setAddress(s.address || "")
          setImageUrl(s.image_url || "")
        }
      } catch (_) {}
      setLoading(false)
    }
    if (id) load()
  }, [id])

  const handleComplete = async () => {
    try {
      if (password && password !== confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" })
        return
      }
      const res = await fetch(`/api/students?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName || null,
          last_name: lastName || null,
          biography,
          image_url: imageUrl || null,
          email: email || null,
          ...(password ? { password } : {}),
          phone: phone || null,
          parent_phone: parentPhone || null,
          address,
        }),
      })
      let data: any = null
      try { data = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => "Failed to update student"))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      toast({ title: "Student updated" })
      router.push("/admin/students")
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || String(e) || "Failed to update student", variant: "destructive" })
    }
  }

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First name<span className="text-red-500">*</span>
          </Label>
          <Input id="firstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last name<span className="text-red-500">*</span>
          </Label>
          <Input id="lastName" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="biography">Biography</Label>
        <div className="border rounded-lg">
          <div className="border-b p-2 flex items-center gap-2 text-sm">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="font-bold">B</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="italic">I</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="underline">U</span>
            </Button>
            <div className="w-px h-4 bg-gray-300" />
            <Button variant="ghost" size="sm" className="h-8 px-2">
              Nunito
            </Button>
          </div>
          <Textarea
            id="biography"
            placeholder="Write something..."
            className="border-0 resize-none focus-visible:ring-0"
            rows={8}
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userImage">User image</Label>
        <div className="flex items-center gap-4">
          <Input id="userImage" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
      </div>
    </div>,

    // Login Credentials Step
    <div key="credentials" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">
          Email<span className="text-red-500">*</span>
        </Label>
        <Input id="email" type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password (leave blank to keep same)</Label>
        <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
    </div>,

    // Social Information Step
    <div key="social" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
        <Input id="parentPhone" placeholder="Enter parent/guardian phone" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" placeholder="Enter address" rows={4} value={address} onChange={(e) => setAddress(e.target.value)} />
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

  if (!id) return null
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading…</div>
      </AdminLayout>
    )
  }

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
    <AdminLayout>
      <MultiStepForm steps={steps} onComplete={handleComplete}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
    </Protect>
  )
}
