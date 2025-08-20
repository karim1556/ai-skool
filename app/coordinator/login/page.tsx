"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CoordinatorLoginPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Coordinator Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email or Phone" />
          <Button className="w-full" onClick={() => router.push("/coordinator/dashboard")}>Continue</Button>
        </CardContent>
      </Card>
    </div>
  )
}
