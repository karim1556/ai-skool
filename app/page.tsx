"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Brain,
  Trophy,
  Atom,
  Calculator,
  Cog,
  Sparkles,
  Cloud,
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  Smartphone,
  BookMarked,
  BarChart,
  ShoppingCart,
  Heart,
  Share2
} from "lucide-react";
import { useState } from "react";
import { Bebas_Neue } from "next/font/google";

// Load condensed font
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "React for Beginners",
      instructor: "Jane Doe",
      category: "Web Development",
      rating: 4.8,
      reviews: 120,
      price: 49,
      originalPrice: 99,
      duration: "8h 30m",
      students: 2000,
    },
    {
      id: 2,
      title: "Advanced Python",
      instructor: "John Smith",
      category: "Programming",
      rating: 4.7,
      reviews: 98,
      price: 59,
      originalPrice: 89,
      duration: "10h 15m",
      students: 1500,
    },
    {
      id: 3,
      title: "UI/UX Design Essentials",
      instructor: "Emily Clark",
      category: "Design",
      rating: 4.9,
      reviews: 150,
      price: 39,
      originalPrice: 79,
      duration: "6h 45m",
      students: 1800,
    },
  ];

  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: "Alex Thompson",
      image: "/placeholder.svg",
      role: "Software Developer at Google"
    },
    {
      id: 2,
      name: "Maria Garcia",
      image: "/placeholder.svg",
      role: "Curriculum Director"
    },
    {
      id: 3,
      name: "Liam Brown",
      image: "/placeholder.svg",
      role: "University Professor"
    },
  ];

  // Mock data for FAQs
  const faqs = [
    {
      question: "What is EduFlow LMS?",
      answer: "EduFlow LMS is a comprehensive learning management system designed to streamline online Skool for institutions and individuals.",
    },
    {
      question: "How do I enroll in a course?",
      answer: "Simply click on the 'Enroll Now' button for your chosen course and follow the registration steps.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a free trial for new users to explore our platform and its features.",
    },
  ];

  // Product data
  const products = [
    {
      id: 1,
      name: "Course Builder Pro",
      description: "Create engaging courses with our drag-and-drop course builder. Add videos, quizzes, assignments, and more.",
      icon: BookMarked,
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      id: 2,
      name: "Analytics Dashboard",
      description: "Track student progress, engagement, and performance with real-time analytics and reports.",
      icon: BarChart,
      gradient: "from-teal-500 to-emerald-600"
    },
    {
      id: 3,
      name: "Mobile Learning App",
      description: "Access courses on-the-go with our native iOS and Android applications.",
      icon: Smartphone,
      gradient: "from-rose-500 to-pink-600"
    },
    {
      id: 4,
      name: "Admin Console",
      description: "Manage users, courses, and permissions with our powerful admin tools.",
      icon: LayoutDashboard,
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  // New product data for e-commerce listing
  const ecommerceProducts = [
    {
      id: 1,
      name: "Premium Online Course Bundle",
      description: "Access to all our premium courses with lifetime updates",
      price: 299,
      originalPrice: 499,
      rating: 4.9,
      reviews: 342,
      image: "/images/course-bundle.jpg",
      category: "Digital Product",
      isBestSeller: true,
      isNew: false,
      inStock: true
    },
    {
      id: 2,
      name: "Educational Tablet for Kids",
      description: "Preloaded with 100+ educational apps and parental controls",
      price: 199,
      originalPrice: 249,
      rating: 4.7,
      reviews: 128,
      image: "/images/kids-tablet.jpg",
      category: "Physical Product",
      isBestSeller: false,
      isNew: true,
      inStock: true
    },
    {
      id: 3,
      name: "Professional Certification Exam Voucher",
      description: "One attempt at our professional certification exam",
      price: 149,
      originalPrice: 199,
      rating: 4.5,
      reviews: 87,
      image: "/images/exam-voucher.jpg",
      category: "Digital Product",
      isBestSeller: false,
      isNew: false,
      inStock: true
    },
    {
      id: 4,
      name: "Learning Management System License",
      description: "Annual license for our premium LMS platform",
      price: 999,
      originalPrice: 1299,
      rating: 4.8,
      reviews: 215,
      image: "/images/lms-license.jpg",
      category: "Software License",
      isBestSeller: true,
      isNew: false,
      inStock: true
    },
    {
      id: 5,
      name: "Educational Board Game Set",
      description: "5 STEM-focused board games for classroom use",
      price: 89,
      originalPrice: 120,
      rating: 4.6,
      reviews: 56,
      image: "/images/board-game.jpg",
      category: "Physical Product",
      isBestSeller: false,
      isNew: true,
      inStock: false
    },
    {
      id: 6,
      name: "Teacher's Resource Kit",
      description: "Complete set of teaching resources and lesson plans",
      price: 129,
      originalPrice: 179,
      rating: 4.9,
      reviews: 92,
      image: "/images/teacher-kit.jpg",
      category: "Physical Product",
      isBestSeller: true,
      isNew: false,
      inStock: true
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 px-4 py-20 md:px-6 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-7xl relative">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  Transform Your{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                    Learning Journey
                  </span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
                  Empower your Skoolal institution with our comprehensive Learning Management System. Streamline
                  courses, manage students, and track progress all in one place.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-sky-600 px-10 py-4 text-lg font-bold text-white hover:from-sky-600 hover:to-sky-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                    GET STARTED
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 bg-transparent tracking-tight"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-60 blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-sky-200 to-sky-300 opacity-60 blur-xl"></div>
              <div className="absolute right-12 top-1/2 h-20 w-20 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-60 blur-xl"></div>
              <div className="relative group">
                <Image
                  src="/images/skool1.png"
                  alt="Students learning online"
                  width={700}
                  height={500}
                  className="relative z-10 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                {/* <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white px-6 py-4 shadow-xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-gray-600 tracking-tight">
                    <span>LEARN MORE</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <div className="space-y-8 mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                thousands
              </span>{" "}
              of{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                educators
              </span>{" "}
              worldwide
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Join educators and students who are already using EduFlow LMS to achieve their learning goals.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#1e3a8a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-[#1e3a8a]" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">10K+</div>
              <div className="text-sm lg:text-base text-gray-600 tracking-tight">Active Students</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#ec4899]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-[#ec4899]" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">500+</div>
              <div className="text-sm lg:text-base text-gray-600 tracking-tight">Courses Available</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">95%</div>
              <div className="text-sm lg:text-base text-gray-600 tracking-tight">Success Rate</div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">4.9</div>
              <div className="text-sm lg:text-base text-gray-600 tracking-tight">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                all-in-one
              </span>{" "}
              learning solution
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              EduFlow LMS takes the guesswork out of online Skool. Our platform provides all the tools and features you need to create, manage, and deliver exceptional learning experiences.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Course Management",
                description: "Create, organize, and manage courses with our intuitive course builder and content management system.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Users,
                title: "Student Management",
                description: "Track student progress, manage enrollments, and provide personalized learning experiences.",
                gradient: "from-purple-500 to-indigo-500",
              },
              {
                icon: TrendingUp,
                title: "Analytics & Reports",
                description: "Get detailed insights into student performance and course effectiveness with comprehensive analytics.",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: Award,
                title: "Assessments & Quizzes",
                description: "Create interactive assessments and quizzes to evaluate student understanding and progress.",
                gradient: "from-orange-500 to-amber-500",
              },
              {
                icon: CheckCircle,
                title: "Progress Tracking",
                description: "Monitor learning progress with detailed tracking and milestone achievements for every student.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Play,
                title: "Interactive Content",
                description: "Engage students with multimedia content, interactive lessons, and collaborative learning tools.",
                gradient: "from-red-500 to-pink-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="space-y-6 p-0">
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium tracking-tight">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Our Products Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Powerful Products
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Discover our suite of specialized tools designed to enhance every aspect of the learning experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div 
                key={product.id}
                className="relative group overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="absolute inset-0 z-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} transition-all duration-500 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-10'
                  }`}></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white,transparent_70%)]"></div>
                </div>
                
                <div className="relative z-10 p-8 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    hoveredProduct === product.id 
                      ? `bg-gradient-to-br ${product.gradient} text-white scale-110`
                      : `bg-gradient-to-br ${product.gradient}/10 text-${product.gradient.split('-')[1]}-500`
                  }`}>
                    <product.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{product.name}</h3>
                  <p className="text-gray-600 mb-6 tracking-tight">{product.description}</p>
                  <Button 
                    variant="outline"
                    className={`rounded-full border-2 font-medium tracking-tight transition-all ${
                      hoveredProduct === product.id 
                        ? `bg-gradient-to-br ${product.gradient} border-transparent text-white hover:opacity-90`
                        : 'bg-transparent'
                    }`}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: E-commerce Product Listing Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Shop our collection of educational products and resources
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ecommerceProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {product.isBestSeller && (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white">
                          Best Seller
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                          New
                        </Badge>
                      )}
                      {!product.inStock && (
                        <Badge className="bg-red-600 hover:bg-red-700 text-white">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100">
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button 
                        disabled={!product.inStock}
                        className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" className="rounded-full border-2 border-gray-300 px-8 py-4 text-lg font-semibold">
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Popular{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Choose from our most popular and highly-rated courses
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course: typeof courses[0]) => (
              <Card
                key={course.id}
                className={`group overflow-hidden rounded-3xl border-0 bg-gradient-to-b from-sky-500 to-sky-600 p-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-b from-sky-400 to-sky-500 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative h-full w-full rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex flex-col items-center justify-center p-6">
                      <Badge className="bg-white text-sky-600 mb-4 tracking-tight">{course.category}</Badge>
                      <h3 className="text-xl font-bold text-white text-center mb-2 tracking-tight">{course.title}</h3>
                      <p className="text-sky-100 text-center mb-4 tracking-tight">{course.instructor}</p>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-white ml-2 tracking-tight">({course.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xl font-bold text-white tracking-tight">${course.price}</span>
                        {course.originalPrice > course.price && (
                          <span className="text-sm text-white/70 line-through tracking-tight">${course.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 text-center text-white space-y-4">
                    <div className="flex items-center justify-between text-sm tracking-tight">
                      <span>{course.duration}</span>
                      <span>{course.students} students</span>
                    </div>
                    <Button className="w-full bg-white text-sky-600 hover:bg-gray-100 font-bold tracking-tight">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
<section className="bg-gradient-to-br from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

  <div className="mx-auto max-w-7xl relative">
    <div className="grid items-center gap-16 lg:grid-cols-2">
      <div className="relative group">
        <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl"></div>
        <Image
          src="/images/classroom-children.png"
          alt="Children gathered around tablet in classroom"
          width={600}
          height={500}
          className="relative rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>
      <div className="space-y-10 text-white">
        <blockquote className="text-3xl font-bold leading-relaxed md:text-4xl">
          "AiSkool LMS has{" "}
          <span className="text-yellow-300">transformed my learning experience</span>. The courses are{" "}
          <span className="text-yellow-300">well-structured</span> and the instructors are{" "}
          <span className="text-yellow-300">top-notch professionals</span>."
        </blockquote>
        <div className="space-y-2">
          <div className="text-lg font-bold uppercase tracking-wider text-sky-100">ALEX THOMPSON</div>
          <div className="text-sky-200 font-medium tracking-tight">Software Developer at Google</div>
        </div>
        <div className="flex items-center space-x-4">
          {testimonials.slice(0, 3).map((t: typeof testimonials[0]) => (
            <div key={t.id} className="flex flex-col items-center text-center">
              <div className="relative group">
                <Image
                  src={t.image || "/placeholder.svg"}
                  alt={t.name}
                  width={60}
                  height={60}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white mb-2 group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-600 opacity-0 group-hover:opacity-30 rounded-full transition-opacity"></div>
              </div>
              <div className="text-sm font-medium text-sky-100">{t.name}</div>
              <div className="text-xs text-sky-200">{t.role}</div>
            </div>
          ))}
        </div>
        <Button className="rounded-full bg-white px-10 py-4 text-lg font-bold text-sky-600 hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg tracking-tight">
          VIEW ALL TESTIMONIALS
        </Button>
      </div>
    </div>
  </div>
</section>


      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 p-0 shadow-2xl">
            <CardContent className="p-0">
              <div className="grid items-center lg:grid-cols-2">
                <div className="space-y-10 p-12 text-white md:p-16">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                    Flexible <span className="text-yellow-300">Pricing</span> for Everyone
                  </h3>
                  <p className="text-lg md:text-xl font-medium text-sky-100 leading-relaxed tracking-tight">
                    Whether you're an individual learner or an enterprise, we have a plan that fits your needs and budget.
                  </p>

                  <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`font-medium ${activeTab === "monthly" ? "text-white" : "text-sky-200"} tracking-tight`}>
                      Monthly
                    </span>
                    <button
                      onClick={() => setActiveTab(activeTab === "monthly" ? "yearly" : "monthly")}
                      className="relative w-12 h-6 bg-white rounded-full transition-colors"
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-sky-500 rounded-full transition-transform ${
                          activeTab === "yearly" ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className={`font-medium ${activeTab === "yearly" ? "text-white" : "text-sky-200"} tracking-tight`}>
                      Yearly
                    </span>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    {[
                      {
                        title: "Starter",
                        price: activeTab === "monthly" ? "Free" : "Free",
                        features: ["Access to 50+ free courses", "Basic progress tracking", "Community access"],
                        highlight: false
                      },
                      {
                        title: "Pro",
                        price: activeTab === "monthly" ? "$29/month" : "$290/year",
                        features: ["Access to all 500+ courses", "Certificates of completion", "Priority support"],
                        highlight: true
                      }
                    ].map((plan, index) => (
                      <div 
                        key={index} 
                        className={`bg-white/20 backdrop-blur-sm p-6 rounded-2xl border ${
                          plan.highlight ? 'border-yellow-400 shadow-lg' : 'border-white/30'
                        } relative overflow-hidden`}
                      >
                        {plan.highlight && (
                          <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full tracking-tight">
                            POPULAR
                          </div>
                        )}
                        <h4 className="font-bold text-xl mb-2 tracking-tight">{plan.title}</h4>
                        <div className="text-2xl font-bold mb-4 tracking-tight">{plan.price}</div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center tracking-tight">
                              <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className={`w-full mt-4 font-bold tracking-tight ${
                          plan.highlight 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:opacity-90' 
                            : 'bg-white text-sky-600 hover:bg-gray-100'
                        }`}>
                          GET STARTED
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=600&width=700"
                    alt="Pricing illustration"
                    width={700}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-8 right-8 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 font-bold text-black shadow-2xl transform hover:scale-105 transition-transform duration-200 tracking-tight">
                    <span className="text-xl">SAVE 17%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Frequently{" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                Asked Questions
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq: typeof faqs[0], index: number) => (
              <Card 
                key={index} 
                className="overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg tracking-tight">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-sky-500 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-sky-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 tracking-tight">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-4xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto tracking-tight">
            Join thousands of educators and students who are already using EduFlow LMS to achieve their learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                size="lg"
                className="rounded-full bg-white text-sky-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-xl tracking-tight"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-sky-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200 tracking-tight"
              >
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}

    </div>
  );
}