"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { User, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const handleParentRegistration = () => {
    router.push("/register/parent")
  }

  const handleTeacherRegistration = () => {
    router.push("/register/teacher")
  }

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-12 md:text-5xl">
            Choose your account type to get started
          </h1>

          <div className="mb-8">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-full text-lg transition-all duration-200 hover:scale-105 shadow-lg">
              JOIN WITH A PARENT CODE
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            {/* Parent Account */}
            <Card
              className="group cursor-pointer border-2 border-gray-200 hover:border-pink-400 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white"
              onClick={handleParentRegistration}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-pink-300 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Parent</h3>
                <p className="text-gray-600 font-medium">Best for use at home</p>
              </CardContent>
            </Card>

            {/* Teacher Account */}
            <Card
              className="group cursor-pointer border-2 border-gray-200 hover:border-sky-400 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white"
              onClick={handleTeacherRegistration}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-sky-300 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Teacher</h3>
                <p className="text-gray-600 font-medium">Best for the classroom</p>
              </CardContent>
            </Card>
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
