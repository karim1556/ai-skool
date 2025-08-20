"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const go = (path: string) => router.push(path)

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 md:text-5xl">
            New to AiSkool?
          </h1>
          <p className="text-gray-600 mb-10">Register as an online student or login if you already have an account.</p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold px-6 py-3 rounded-full text-lg" onClick={() => go("/register/online-student")}>
              <User className="w-5 h-5 mr-2" /> Register here
            </Button>
            <Button variant="outline" className="px-6 py-3 rounded-full text-lg" onClick={() => go("/login")}>
              Login
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="font-bold text-lg mb-4 text-sky-400">EDUCATORS</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Classroom Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Professional Development
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-sky-400">PARENTS</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Home Learning
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Progress Tracking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-sky-400">RESOURCES</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Research
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-sky-400">CONNECT</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-sky-400 transition-colors">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
