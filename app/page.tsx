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
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Smartphone,
  BookMarked,
  BarChart,
  ShoppingCart,
  Heart,
  Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Bebas_Neue } from "next/font/google";
import { useCart } from "@/hooks/use-cart";

// Load condensed font
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function HomePage() {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [courseLevel, setCourseLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>("all");
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [levelCourses, setLevelCourses] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  // Number of level pills per page
  const pageSize = 3;

  // Fetch all levels from API
  useEffect(() => {
    let ignore = false;
    async function loadLevels() {
      try {
        const res = await fetch('/api/levels', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load levels');
        let data = await res.json();
        if (!Array.isArray(data)) data = [];
        // Sort by configured order field if present, fallback to id
        data.sort((a: any, b: any) => {
          const ka = Number(a.order ?? a.level_order ?? a.levelOrder ?? a.position ?? a.id ?? 0)
          const kb = Number(b.order ?? b.level_order ?? b.levelOrder ?? b.position ?? b.id ?? 0)
          if (!Number.isNaN(ka) && !Number.isNaN(kb) && (ka !== kb)) return ka - kb
          return a.id - b.id
        })
        if (!ignore) {
          setLevels(data);
          if (data.length > 0 && selectedLevelId === null) setSelectedLevelId(data[0].id);
        }
      } catch (_e) {
        if (!ignore) setLevels([]);
      }
    }
    loadLevels();
    return () => { ignore = true; };
  }, []);

  // Fetch courses by selected level
  useEffect(() => {
    if (selectedLevelId == null) return;
    let ignore = false;
    async function loadCourses() {
      try {
        const res = await fetch(`/api/levels/${selectedLevelId}/courses`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load courses for level ${selectedLevelId}`);
        const data = await res.json();
        if (!ignore) setLevelCourses(Array.isArray(data) ? data : []);
      } catch (_e) {
        if (!ignore) setLevelCourses([]);
      }
    }
    loadCourses();
    return () => { ignore = true; };
  }, [selectedLevelId]);

  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "React for Beginners",
      instructor: "Jane Doe",
      category: "Web Development",
      level: "beginner" as const,
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
      level: "intermediate" as const,
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
      level: "advanced" as const,
      rating: 4.9,
      reviews: 150,
      price: 39,
      originalPrice: 79,
      duration: "6h 45m",
      students: 1800,
    },
  ];

  // Courses to show in UI: prefer API level courses; fallback to mock courses for Level 1 when empty
  const displayedCourses: any[] = (selectedLevelId === 1 && levelCourses.length === 0)
    ? courses
    : levelCourses;

  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: "Karim Shaikh",
      image: "/placeholder.svg",
      role: "Software Developer"
    },
    {
      id: 2,
      name: "Adesh Rai",
      image: "/placeholder.svg",
      role: "Curriculum Director"
    },
    {
      id: 3,
      name: "Anjum Mujawar",
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

  // Product data (Top 3 reasons)
  const products = [
    {
      id: 1,
      name: "Best Engaging",
      description:
        "One of the best options to engage your child and keep him/her away from TV & Video games. Annual Robotics Challenges like SPARC have them building Robots willingly and happily!",
      icon: Heart,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      id: 2,
      name: "Futuristic Learning",
      description:
        "Engaging in a future-based learning activity like Robotics, Drone, IOT, VR, AI and Android, is very useful for the child's future too. Child learns Science, Math and Coding in a very fun way with Robots and other activities.",
      icon: Atom,
      gradient: "from-teal-500 to-emerald-600",
    },
    {
      id: 3,
      name: "Skill Development",
      description:
        "Creativity of the child increases having learnt Electronics & Coding—which comes to life using their own Robots! Showcasing team spirit and competitive skills in events like SPARC highly improves their overall holistic development!",
      icon: Trophy,
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  // Default e-commerce products used as a fallback if the API is unavailable
  const defaultEcommerceProducts = [
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
      name: "Educational Board Game Karim Shaikh",
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

  // Stateful ecommerce products list — fetch from API and fall back to defaults
  const [ecommerceProducts, setEcommerceProducts] = useState(defaultEcommerceProducts);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const res = await fetch('/api/products?limit=6', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();

        // Accept several possible shapes from the API: array, { products: [] }, { items: [] }
        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data.products)) items = data.products;
        else if (Array.isArray(data.items)) items = data.items;

        const mapped = items.map((item: any) => ({
          id: item.id ?? item._id ?? Math.random(),
          name: item.name || item.title || 'Product',
          description: item.description || item.short_description || '',
          price: Number(item.price ?? item.price_cents ?? 0),
          originalPrice: Number(item.originalPrice ?? item.list_price ?? item.original_price ?? 0),
          rating: Number(item.rating ?? 0),
          reviews: Number(item.reviews ?? item.review_count ?? 0),
          image: item.image || item.image_url || item.thumbnail || '/images/placeholder.svg',
          category: item.category || item.provider || '',
          isBestSeller: Boolean(item.isBestSeller || item.best_seller || item.is_best_seller),
          isNew: Boolean(item.isNew || item.new),
          inStock: 'in_stock' in item ? Boolean(item.in_stock) : (item.inStock ?? true),
        }));

        if (!ignore && mapped.length > 0) setEcommerceProducts(mapped.slice(0, 6));
      } catch (_e) {
        // keep defaults on error
      }
    }

    loadProducts();
    return () => { ignore = true; };
  }, []);

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
                  Make your child{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                    future ready
                  </span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
                  Let your child explore the world of STEM, Robotics, Coding & AI to develop 21st century skills.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-sky-600 px-10 py-4 text-lg font-bold text-white hover:from-sky-600 hover:to-sky-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                    GET STARTED
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
              Become a {" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                change maker
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Innovate today for a better tomorrow by inculcating the indispensable skills of the 21st century.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Innovativeness",
                description: "Foster curiosity and groundbreaking ideas through hands-on exploration.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Brain,
                title: "Logical Reasoning",
                description: "Build strong analytical thinking with structured challenges and activities.",
                gradient: "from-purple-500 to-indigo-500",
              },
              {
                icon: Zap,
                title: "Creativity",
                description: "Encourage original thinking, design, and expression across disciplines.",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: Atom,
                title: "Critical Thinking",
                description: "Evaluate information, question assumptions, and make informed decisions.",
                gradient: "from-orange-500 to-amber-500",
              },
              {
                icon: Calculator,
                title: "Problem Solving",
                description: "Tackle real-world problems using STEM, coding, and design thinking.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Users,
                title: "Team Work",
                description: "Collaborate effectively, communicate clearly, and lead with empathy.",
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
          {displayedCourses.length === 0 && (
            <div className="mt-8 text-center text-gray-600">
              No courses found for Level {selectedLevelId}. Please check back later.
            </div>
          )}
        </div>
      </section>

      {/* Popular Courses (moved above products) */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Find the right {" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                course for you
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Browse by Level
            </p>
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 rounded bg-white border shadow-sm disabled:opacity-50"
                  aria-label="Previous levels"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex overflow-x-auto no-scrollbar space-x-3 py-2 px-1">
                  {levels
                    .slice(page * pageSize, (page + 1) * pageSize)
                    .map((lvl: any) => {
                      const levelId = lvl.id; // actual DB id
                      const label = `Level ${levelId}`;
                      const isSelected = selectedLevelId === levelId;
                      return (
                        <button
                          key={levelId}
                          onClick={() => setSelectedLevelId(levelId)}
                          data-level-id={levelId}
                          className={`flex items-center gap-3 min-w-[120px] px-4 py-2 rounded-xl transition-all shadow-sm border ${isSelected ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-white border-transparent text-gray-600 hover:shadow-md'}`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${isSelected ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            {levelId}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-semibold">{label}</div>
                            <div className="text-xs text-gray-500">{lvl.category || ''}</div>
                          </div>
                        </button>
                      );
                    })}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * pageSize >= levels.length}
                  className="p-2 rounded bg-white border shadow-sm disabled:opacity-50"
                  aria-label="Next levels"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {levels.length > pageSize && (
              <p className="mt-3 text-sm text-gray-500">Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, levels.length)} of {levels.length} levels</p>
            )}
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {displayedCourses.length === 0 && (
              <div className="col-span-full text-center text-gray-600">
                {`No courses found for Level ${selectedLevelId}. Please check back later.`}
              </div>
            )}
            {displayedCourses.map((course: any) => (
              <Card
                key={course.id || course.title}
                className={`group overflow-hidden rounded-3xl border-0 p-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={course.image || "/placeholder.svg?height=240&width=360"}
                      alt={course.title || "Course thumbnail"}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge className="bg-sky-100 text-sky-700">{`Level ${selectedLevelId}`}{course.category ? ` • ${course.category}` : ''}</Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(Number(course.rating) || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({Number(course.reviews) || 0})</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 tracking-tight line-clamp-2">{course.title || 'Course'}</h3>
                    <p className="mt-1 text-sm text-gray-600 tracking-tight">{course.provider || course.instructor || 'Instructor'}</p>

                    {/* Pricing */}
                    <div className="mt-4 flex items-center gap-2">
                      {course.is_free ? (
                        <span className="text-lg font-bold text-green-600">Free</span>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-gray-900">${Number(course.price || 0)}</span>
                          {Number(course.original_price || 0) > Number(course.price || 0) && (
                            <span className="text-sm text-gray-500 line-through ml-2">${Number(course.original_price)}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <span>{course.duration || '—'}</span>
                      <span>{Number(course.students || 0)} students</span>
                    </div>

                    <Button className="mt-5 w-full bg-sky-600 text-white hover:bg-sky-700 font-bold tracking-tight">
                      Enroll Now
                    </Button>
                  </div>
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
              Top 3 reasons why {" "}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                1 Lac+ Parents
              </span>{" "}
              choose us
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              What sets us apart for your child’s growth and engagement.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3">
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
                        onClick={() => addItem({
                          id: product.id,
                          title: product.name,
                          price: Number(product.price || 0),
                          originalPrice: Number(product.originalPrice || 0) || undefined,
                          image: product.image || null,
                          provider: product.category || null,
                          type: "product",
                        })}
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
          <div className="text-lg font-bold uppercase tracking-wider text-sky-100">Karim Shaikh</div>
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
      {/* <section className="bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
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
      </section> */}

      {/* Footer */}

    </div>
  );
}