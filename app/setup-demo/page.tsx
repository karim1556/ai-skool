import { CreateDemoUsersButton } from "@/components/auth/create-demo-users-button"
import { DemoCredentials } from "@/components/auth/demo-credentials"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function SetupDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Demo Setup</h1>
          <p className="text-muted-foreground">Set up demo users to test all dashboard features</p>
        </div>

        <div className="space-y-6">
          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <InfoIcon className="h-5 w-5" />
                Setup Instructions
              </CardTitle>
              <CardDescription>Follow these steps to set up demo users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> Make sure you have set the <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
                  environment variable. You can find this key in your Supabase project settings under API.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h4 className="font-semibold">Step 1: Create Demo Users</h4>
                <p className="text-sm text-muted-foreground">
                  Click the button below to automatically create all demo users with their authentication credentials
                  and profiles.
                </p>
                <CreateDemoUsersButton />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Step 2: Use Demo Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  After creating the users, you can use the credentials below to log in and test different dashboards.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <DemoCredentials />

          {/* Manual Setup Alternative */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Setup (Alternative)</CardTitle>
              <CardDescription>If the automatic setup doesn't work, you can create users manually</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="text-sm space-y-2">
                <li>1. Go to your Supabase project dashboard</li>
                <li>2. Navigate to Authentication {">"} Users</li>
                <li>3. Click "Add user" and create each user with the emails and passwords shown above</li>
                <li>4. Make sure to set "Email confirmed" to true for each user</li>
                <li>5. The profiles will be created automatically when users first sign in</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
