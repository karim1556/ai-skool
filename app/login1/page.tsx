"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, ShieldCheck, Lock, Chrome } from "lucide-react"

export default function Login1Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-fuchsia-50 via-white to-sky-50">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-fuchsia-300 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-sky-300 opacity-20 blur-3xl" />

      {/* Subtle grid background overlay (animated) */}
      <div
        aria-hidden
        className="animated-grid pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "0px 0px, 0px 0px",
          willChange: "background-position",
        }}
      />
      {/* Waves restricted to grid lines (mask-based) */}

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Brand/Marketing */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/70 px-3 py-1 text-sm text-fuchsia-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Welcome back to AiSkool
              {/* Page-scoped animation styles */}
      <style jsx global>{`
        @keyframes grid-drift {
          0% { background-position: 0px 0px, 0px 0px; }
          100% { background-position: 120px 120px, 120px 120px; }
        }
        .animated-grid {
          animation: grid-drift 22s linear infinite alternate;
        }
      `}</style>
    </div>
            <h1 className="mb-4 text-4xl font-black leading-tight text-gray-900 md:text-5xl">
              Learn faster. Teach smarter.
            </h1>
            <p className="mb-8 max-w-xl text-gray-600">
              Sign in to access your personalized dashboard — whether you’re a student, coordinator, trainer, or admin.
            </p>

            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur">
                <ShieldCheck className="mt-1 h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold">Secure by design</p>
                  <p className="text-sm text-gray-600">Your data is protected with best practices.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur">
                <Lock className="mt-1 h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-semibold">Single login for everyone</p>
                  <p className="text-sm text-gray-600">One form. Roles are resolved after sign in.</p>
                </div>
              </div>
            </div>

            <div className="relative flex items-center gap-6">
              {/* Floating decorative icons */}
              <div className="pointer-events-none absolute -left-8 -top-6 hidden rotate-6 md:block">
                <Sparkles className="h-6 w-6 text-fuchsia-500 animate-pulse" />
              </div>
              <div className="pointer-events-none absolute -right-8 -bottom-6 hidden -rotate-6 md:block">
                <Lock className="h-6 w-6 text-sky-500 animate-bounce" />
              </div>
              <Image
                src="/images/skool1.png"
                alt="AiSkool Illustration"
                className="rounded-xl border shadow-md"
                width={320}
                height={200}
                priority
              />
              <div className="hidden text-sm text-gray-500 sm:block">
                New to AiSkool? {""}
                <Link href="/register/online-student" className="font-medium text-fuchsia-600 hover:underline">
                  Register as an Online Student
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-fuchsia-400 to-sky-400 opacity-30 blur" />
                <div className="relative rounded-3xl border bg-white/80 p-6 shadow-xl backdrop-blur">
                  <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Sign in to AiSkool</h2>
                    <p className="text-sm text-gray-600">Enter your email and password to continue</p>
                  </div>
                  <LoginForm />
                  {/* Social login divider */}
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <span className="text-xs text-gray-500">or</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  {/* Google style button (UI only) */}
                  <Button variant="outline" className="w-full gap-2">
                    <Chrome className="h-4 w-4" /> Continue with Google
                  </Button>
                  <div className="mt-4 text-center text-sm text-gray-600">
                    New here? {""}
                    <Link href="/register/online-student" className="font-medium text-fuchsia-600 hover:underline">
                      Create an account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
