"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DemoCredentials() {
  const credentials = [
    {
      role: "Admin",
      email: "admin@eduflow.com",
      password: "admin123",
      description: "Full system access, user management, batch approvals",
      color: "bg-red-100 text-red-800",
    },
    {
      role: "Trainer",
      email: "trainer@eduflow.com",
      password: "trainer123",
      description: "Batch management, session control, attendance tracking",
      color: "bg-blue-100 text-blue-800",
    },
    {
      role: "Instructor",
      email: "instructor@eduflow.com",
      password: "instructor123",
      description: "Similar to trainer with course instruction focus",
      color: "bg-purple-100 text-purple-800",
    },
    {
      role: "Student",
      email: "student@eduflow.com",
      password: "student123",
      description: "Course enrollment, session participation, assignments",
      color: "bg-green-100 text-green-800",
    },
    {
      role: "School Coordinator",
      email: "coordinator@eduflow.com",
      password: "coordinator123",
      description: "Registration oversight, student management",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      role: "Camp Coordinator",
      email: "camp@eduflow.com",
      password: "camp123",
      description: "Workshop and camp management",
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Demo Login Credentials</h2>
        <p className="text-muted-foreground">Use these credentials to test different dashboard views</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {credentials.map((cred) => (
          <Card key={cred.role} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{cred.role}</CardTitle>
                <Badge className={cred.color}>{cred.role}</Badge>
              </div>
              <CardDescription className="text-sm">{cred.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(cred.email)} className="h-6 px-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="block text-xs bg-gray-100 p-2 rounded">{cred.email}</code>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Password:</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(cred.password)} className="h-6 px-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="block text-xs bg-gray-100 p-2 rounded">{cred.password}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Setup Instructions:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Run the SQL script to create dummy users and sample data</li>
          <li>2. In Supabase Auth, manually create users with the above email addresses</li>
          <li>3. Set the passwords as shown above for each user</li>
          <li>4. The profiles will be automatically linked when users sign in</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important Note:</h3>
        <p className="text-sm text-amber-800">
          Since Supabase handles authentication, you'll need to create these users in your Supabase Auth dashboard
          manually, or modify the registration process to allow these specific emails without email verification for
          demo purposes.
        </p>
      </div>
    </div>
  )
}
