"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function OnlineStudentRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const submit = async () => {
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
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>Online Student Registration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>
          <Button className="w-full" onClick={submit}>Register</Button>
        </CardContent>
      </Card>
    </div>
  )
}
