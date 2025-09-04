"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { User, ShieldCheck, Clock, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const go = (path: string) => router.push(path)

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-fuchsia-50 via-white to-sky-50">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-300 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-sky-300 opacity-20 blur-3xl" />

      <div className="px-4 pt-20 pb-6 md:px-6 md:pb-10">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          {/* Left - copy */}
          <div className="text-center md:text-left">
            <h1 className="mb-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-sky-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
              New to AiSkool?
            </h1>
            <p className="mb-8 max-w-xl text-gray-600 md:mx-0 mx-auto">
              Create your student account to start learning. If you already have an account, just sign in.
            </p>

            <div className="mb-10 flex flex-wrap items-center gap-3 md:justify-start justify-center">
              <Button className="bg-fuchsia-500 hover:bg-fuchsia-600 px-6 py-3 text-lg font-semibold text-white" onClick={() => go("/register/online-student")}>
                <User className="mr-2 h-5 w-5" /> Register as Online Student
              </Button>
              <Button variant="outline" className="px-6 py-3 text-lg" onClick={() => go("/login")}>
                Login
              </Button>
            </div>

            <ul className="mx-auto grid max-w-md list-disc space-y-2 pl-5 text-sm text-gray-700 md:mx-0">
              <li>Single, secure login for all roles</li>
              <li>Learn anywhere, access on any device</li>
              <li>No credit card required to start</li>
            </ul>
          </div>

          {/* Right - decorative info card (no image) */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fuchsia-400 to-sky-400 opacity-30 blur" />
            <Card className="relative rounded-3xl border bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-fuchsia-600">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">Why join AiSkool</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>Secure platform with best practices and privacy-by-design.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-sky-600" />
                  <span>Learn at your own pace with lifetime course access.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-fuchsia-600" />
                  <span>Modern, clean interface focused on your learning.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Highlights */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4 text-left">
              <p className="font-semibold">Quick signup</p>
              <p className="text-sm text-gray-600">It only takes a minute to get started.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-left">
              <p className="font-semibold">Learn at your pace</p>
              <p className="text-sm text-gray-600">Access courses anytime on any device.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-left">
              <p className="font-semibold">Secure login</p>
              <p className="text-sm text-gray-600">Your data stays private and protected.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-fuchsia-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Site-wide footer is provided globally; removing local footer to avoid duplication */}
    </div>
  )
}
