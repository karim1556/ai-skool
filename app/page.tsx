"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Quote,
  Plus,
  Minus,
  Play,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("monthly")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const courses = [
    {
      id: 1,
      title: "JavaScript: Understanding the Weird Parts",
      instructor: "Johnny Depp",
      image: "/placeholder.svg?height=200&width=300",
      rating: 5.0,
      reviews: 1,
      price: 50.0,
      originalPrice: 80.0,
      cashback: 5,
      category: "Development",
      duration: "12 hours",
      students: 1250,
    },
    {
      id: 2,
      title: "Python for Beginners - Learn Programming",
      instructor: "Jack Nicholson",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      reviews: 324,
      price: 49.0,
      originalPrice: 70.0,
      cashback: 4.9,
      category: "Development",
      duration: "8 hours",
      students: 890,
    },
    {
      id: 3,
      title: "The Complete 2022 Web Development Bootcamp",
      instructor: "Jack Nicholson",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      reviews: 567,
      price: 49.0,
      originalPrice: 70.0,
      cashback: 4.9,
      category: "Development",
      duration: "24 hours",
      students: 2340,
    },
    {
      id: 4,
      title: "React + Next JS with TypeScript",
      instructor: "Jack Nicholson",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      reviews: 189,
      price: 69.0,
      originalPrice: 90.0,
      cashback: 6.9,
      category: "Development",
      duration: "16 hours",
      students: 756,
    },
  ]

  const upcomingCourses = [
    {
      id: 1,
      title: "Advanced Machine Learning",
      instructor: "Dr. Sarah Wilson",
      startDate: "Jan 15, 2024",
      image: "/placeholder.svg?height=200&width=300",
      students: 245,
      category: "AI & ML",
    },
    {
      id: 2,
      title: "Blockchain Development",
      instructor: "Mike Johnson",
      startDate: "Jan 22, 2024",
      image: "/placeholder.svg?height=200&width=300",
      students: 189,
      category: "Development",
    },
  ]

  const bundleCourses = [
    {
      id: 1,
      title: "Full Stack Developer Bundle",
      courses: 8,
      originalPrice: 400,
      bundlePrice: 199,
      image: "/placeholder.svg?height=200&width=300",
      savings: "50% OFF",
      duration: "120 hours",
    },
    {
      id: 2,
      title: "Data Science Master Bundle",
      courses: 12,
      originalPrice: 600,
      bundlePrice: 299,
      image: "/placeholder.svg?height=200&width=300",
      savings: "50% OFF",
      duration: "180 hours",
    },
  ]

  const instructors = [
    {
      id: 1,
      name: "Dr. Emily Chen",
      specialty: "Machine Learning",
      rating: 4.9,
      students: 15420,
      courses: 12,
      image: "/placeholder.svg?height=100&width=100",
      experience: "8 years",
    },
    {
      id: 2,
      name: "Mark Rodriguez",
      specialty: "Web Development",
      rating: 4.8,
      students: 23150,
      courses: 18,
      image: "/placeholder.svg?height=100&width=100",
      experience: "10 years",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      specialty: "Data Science",
      rating: 4.9,
      students: 18750,
      courses: 15,
      image: "/placeholder.svg?height=100&width=100",
      experience: "7 years",
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Software Developer",
      content:
        "EduFlow LMS transformed my learning experience. The courses are well-structured and the instructors are top-notch.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
      company: "Google",
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Data Analyst",
      content:
        "I've completed 5 courses here and landed my dream job. The practical approach to learning is incredible.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
      company: "Microsoft",
    },
    {
      id: 3,
      name: "David Kim",
      role: "Product Manager",
      content:
        "The flexibility and quality of courses here is unmatched. Highly recommend to anyone looking to upskill.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
      company: "Apple",
    },
  ]

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        "Simply browse our course catalog, select the course you're interested in, and click 'Enroll Now'. You can pay securely and start learning immediately.",
    },
    {
      question: "Are there any prerequisites for courses?",
      answer:
        "Prerequisites vary by course. Each course page clearly lists any required knowledge or skills. We also offer beginner-friendly courses for those just starting out.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your course, contact our support team for a full refund.",
    },
    {
      question: "Do I get a certificate upon completion?",
      answer:
        "Yes, you'll receive a verified certificate of completion for each course you finish. These certificates can be shared on LinkedIn and added to your resume.",
    },
    {
      question: "How long do I have access to course materials?",
      answer:
        "Once you enroll in a course, you have lifetime access to all course materials, including future updates and additional content.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-xl font-bold">EduFlow LMS</span>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="#courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                Courses
              </Link>
              <Link href="#instructors" className="text-gray-600 hover:text-gray-900 transition-colors">
                Instructors
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] hover:from-[#1e40af] hover:to-[#f472b6]"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-[#1e3a8a]/5 via-white to-[#ec4899]/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <Badge className="bg-[#ec4899]/10 text-[#ec4899] hover:bg-[#ec4899]/20 border-[#ec4899]/20">
                  🚀 Next Generation Learning Platform
                </Badge>
                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  Transform Your
                  <span className="bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
                    {" "}
                    Learning Journey
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Empower your educational institution with our comprehensive Learning Management System. Streamline
                  courses, manage students, and track progress all in one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] hover:from-[#1e40af] hover:to-[#f472b6]"
                  >
                    Start Learning Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ec4899] to-[#1e3a8a] border-2 border-white"></div>
                  </div>
                  <span className="text-sm text-gray-600">10,000+ Active Learners</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-[#1e3a8a]/10 to-[#ec4899]/10 rounded-2xl p-6 lg:p-8">
                <div className="bg-white rounded-xl shadow-xl p-4 lg:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Course Progress</h3>
                      <Badge className="bg-green-100 text-green-700">85% Complete</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Introduction to React</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Component Lifecycle</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-[#ec4899]/30"></div>
                        <span className="text-sm text-gray-600">State Management</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#1e3a8a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-[#1e3a8a]" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-sm lg:text-base text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#ec4899]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-[#ec4899]" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm lg:text-base text-gray-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">95%</div>
              <div className="text-sm lg:text-base text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">4.9</div>
              <div className="text-sm lg:text-base text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and features you need to create, manage, and deliver
              exceptional learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/10">
              <CardHeader>
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Course Management</CardTitle>
                <CardDescription>
                  Create, organize, and manage courses with our intuitive course builder and content management system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-[#ec4899]/5 to-[#ec4899]/10">
              <CardHeader>
                <div className="w-12 h-12 bg-[#ec4899] rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Student Management</CardTitle>
                <CardDescription>
                  Track student progress, manage enrollments, and provide personalized learning experiences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analytics & Reports</CardTitle>
                <CardDescription>
                  Get detailed insights into student performance and course effectiveness with comprehensive analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Assessments & Quizzes</CardTitle>
                <CardDescription>
                  Create interactive assessments and quizzes to evaluate student understanding and progress.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-[#ec4899]/5 to-[#1e3a8a]/5">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-[#ec4899] to-[#1e3a8a] rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor learning progress with detailed tracking and milestone achievements for every student.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-cyan-50 to-cyan-100">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Interactive Content</CardTitle>
                <CardDescription>
                  Engage students with multimedia content, interactive lessons, and collaborative learning tools.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section id="courses" className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Popular Courses</h2>
              <p className="text-gray-600">Choose from our most popular and highly-rated courses</p>
            </div>
            <Button
              variant="outline"
              className="hidden lg:flex bg-transparent border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
            >
              View All Courses →
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-[#1e3a8a]">{course.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {course.rating} ({course.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                    <span>{course.duration}</span>
                    <span>{course.students} students</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#ec4899]">${course.price}</span>
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="bg-[#ec4899] hover:bg-[#f472b6]">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Courses Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Upcoming Courses</h2>
            <p className="text-gray-600">Get ready for our exciting new courses launching soon</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {upcomingCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-orange-500">Coming Soon</Badge>
                  <Badge className="absolute top-3 right-3 bg-[#1e3a8a]">{course.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {course.startDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students} interested
                    </span>
                  </div>
                  <Button className="w-full bg-[#ec4899] hover:bg-[#f472b6]">Notify Me</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Courses Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Course Bundles</h2>
            <p className="text-gray-600">Save big with our comprehensive course bundles</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bundleCourses.map((bundle) => (
              <Card key={bundle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={bundle.image || "/placeholder.svg"}
                    alt={bundle.title}
                    width={400}
                    height={250}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">{bundle.savings}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{bundle.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{bundle.courses} courses included</span>
                    <span>{bundle.duration} total content</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#1e3a8a]">${bundle.bundlePrice}</span>
                      <span className="text-lg text-gray-500 line-through">${bundle.originalPrice}</span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      Save ${bundle.originalPrice - bundle.bundlePrice}
                    </span>
                  </div>

                  <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]">Get Bundle</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section id="instructors" className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet Our Expert Instructors</h2>
            <p className="text-gray-600">Learn from industry professionals with years of experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <Image
                      src={instructor.image || "/placeholder.svg"}
                      alt={instructor.name}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                  <p className="text-[#ec4899] font-medium mb-1">{instructor.specialty}</p>
                  <p className="text-sm text-gray-600 mb-3">{instructor.experience} experience</p>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{instructor.rating}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="font-semibold text-gray-900">{instructor.students.toLocaleString()}</div>
                      <div>Students</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{instructor.courses}</div>
                      <div>Courses</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="pricing" className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 mb-8">Select the perfect plan for your learning journey</p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`font-medium ${activeTab === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
                Monthly
              </span>
              <button
                onClick={() => setActiveTab(activeTab === "monthly" ? "yearly" : "monthly")}
                className="relative w-12 h-6 bg-[#1e3a8a] rounded-full transition-colors"
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    activeTab === "yearly" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`font-medium ${activeTab === "yearly" ? "text-gray-900" : "text-gray-500"}`}>
                Yearly
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
              <div className="bg-[#1e3a8a] text-white text-center py-2 text-sm font-medium">Most Popular</div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Starter</h3>
                <div className="text-3xl font-bold text-gray-900 mb-6">Free</div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Access to 50+ free courses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Basic progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Community access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Mobile app access</span>
                  </div>
                </div>

                <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative overflow-hidden border-2 border-[#ec4899] hover:shadow-lg transition-shadow">
              <div className="bg-[#ec4899] text-white text-center py-2 text-sm font-medium">Recommended</div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#ec4899]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[#ec4899]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    ${activeTab === "monthly" ? "29" : "290"}/{activeTab === "monthly" ? "month" : "year"}
                  </div>
                  {activeTab === "yearly" && <div className="text-sm text-green-600">Save 17%</div>}
                </div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Access to all 500+ courses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Certificates of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Offline downloads</span>
                  </div>
                </div>

                <Button className="w-full bg-[#ec4899] hover:bg-[#f472b6]">Start Pro Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] text-white text-center py-2 text-sm font-medium">
                For Teams
              </div>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1e3a8a]/10 to-[#ec4899]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-[#1e3a8a]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    ${activeTab === "monthly" ? "99" : "990"}/{activeTab === "monthly" ? "month" : "year"}
                  </div>
                  {activeTab === "yearly" && <div className="text-sm text-green-600">Save 17%</div>}
                </div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Team management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Custom integrations</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] hover:from-[#1e40af] hover:to-[#f472b6]">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-gray-600">Hear from our successful learners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-gray-300 mb-4" />

                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>

                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about our platform</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-[#ec4899] flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#ec4899] flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">About EduFlow LMS</h2>
              <p className="text-gray-600 mb-6">
                We are dedicated to transforming education through innovative technology and expert instruction. Our
                platform connects learners with world-class educators, providing accessible, high-quality education for
                everyone.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1e3a8a] mb-2">50K+</div>
                  <div className="text-gray-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ec4899] mb-2">1000+</div>
                  <div className="text-gray-600">Expert Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1e3a8a] mb-2">5000+</div>
                  <div className="text-gray-600">Online Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ec4899] mb-2">98%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] hover:from-[#1e40af] hover:to-[#f472b6]"
              >
                Learn More About Us
              </Button>
            </div>
            <div>
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="About us"
                width={500}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899]">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-lg lg:text-xl text-white/90 mb-8">
              Join thousands of educators and students who are already using EduFlow LMS to achieve their learning
              goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-white text-[#1e3a8a] hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#1e3a8a] bg-transparent"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#1e3a8a] to-[#ec4899] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">E</span>
                </div>
                <span className="text-xl font-bold">EduFlow LMS</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering education through innovative learning management solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EduFlow LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
