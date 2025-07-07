"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users } from "lucide-react"

export function CreateDemoUsersButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const createDemoUsers = async () => {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/create-demo-users", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        setMessage("Demo users created successfully! You can now log in with the provided credentials.")
      } else {
        setError(result.error || "Failed to create demo users")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={createDemoUsers} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Demo Users...
          </>
        ) : (
          <>
            <Users className="mr-2 h-4 w-4" />
            Create Demo Users
          </>
        )}
      </Button>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
