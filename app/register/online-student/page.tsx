"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function OnlineStudentRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!firstName || !lastName || !email) {
      toast({ title: "Missing info", description: "Please fill your name and email.", variant: "destructive" })
      return
    }
    const emailOk = /.+@.+\..+/.test(email)
    if (!emailOk) {
      toast({ title: "Invalid email", description: "Enter a valid email address.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to register")
      toast({ title: "Registered as Online Student" })
      router.push("/online/dashboard")
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || String(e), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-fuchsia-50 via-white to-sky-50 px-4 py-16">
      {/* Center container */}
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h1 className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-600 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
            Create your AiSkool account
          </h1>
          <p className="mt-2 text-sm text-gray-600">Online Student registration</p>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fuchsia-400 to-sky-400 opacity-30 blur" />
          <Card className="relative rounded-3xl border bg-white/80 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle>Online Student Registration</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First name</Label>
                  <Input placeholder="e.g. Priya" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Last name</Label>
                  <Input placeholder="e.g. Sharma" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone <span className="text-xs text-gray-500">(optional)</span></Label>
                <Input placeholder="+91 98xxxxxxx" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              </div>
              <Button className="w-full" onClick={submit} disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
              <p className="pt-2 text-center text-sm text-gray-600">
                Already have an account? {""}
                <Link href="/login" className="font-medium text-fuchsia-600 hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
