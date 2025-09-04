"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CampCoordinatorRegisterPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>Camp/Workshop Coordinator Registration</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-700">Public registration for coordinators is disabled.</p>
          <p className="text-gray-600">Accounts are provisioned by Super Admin. Please use your login credentials.</p>
          <div className="flex justify-center">
            <Button onClick={() => router.push("/coordinator/login")}>Coordinator Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
