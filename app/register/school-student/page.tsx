"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SchoolStudentRegisterPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>School Student Registration</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-700">Public registration for school students is disabled.</p>
          <p className="text-gray-600">Accounts are created by your School Coordinator/Admin. Please use your login credentials.</p>
          <div className="flex justify-center">
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
