"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  BookOpen,
  Smartphone,
  Laptop,
  Code,
  Brain,
  Bot,
  Cpu,
  Zap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Star,
  Clock,
  FileText,
  Video,
  Palette,
  Database,
  Cloud,
  Shield,
  Users,
  BookMarked,
  GraduationCap,
  Wrench,
  PlayCircle,
  FolderOpen,
  Search
} from "lucide-react";
import { useState } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("software");
  const [searchQuery, setSearchQuery] = useState("");

  // Resource categories
  const categories = [
    {
      id: "software",
      name: "Software Downloads",
      icon: Laptop,
      description: "Essential software and tools for robotics programming",
      color: "from-blue-500 to-cyan-500",
      count: 28
    },
    {
      id: "books",
      name: "Free Books & Guides",
      icon: BookOpen,
      description: "Comprehensive learning materials and textbooks",
      color: "from-purple-500 to-indigo-500",
      count: 45
    },
    {
      id: "apps",
      name: "Mobile Apps",
      icon: Smartphone,
      description: "Robotics apps for learning and programming",
      color: "from-green-500 to-emerald-500",
      count: 32
    },
    {
      id: "tutorials",
      name: "Video Tutorials",
      icon: PlayCircle,
      description: "Step-by-step video guides and courses",
      color: "from-orange-500 to-amber-500",
      count: 156
    }
  ];

  // Software Resources
  const softwareResources = [
    {
      id: 1,
      name: "Arduino IDE",
      description: "Official Arduino development environment for programming Arduino boards",
      version: "2.3.2",
      size: "350 MB",
      downloads: "2.4M+",
      rating: 4.8,
      platform: ["Windows", "Mac", "Linux"],
      category: "Programming",
      difficulty: "Beginner",
      downloadLink: "https://www.arduino.cc/en/software",
      official: true,
      featured: true
    },
    {
      id: 2,
      name: "Python 3.11",
      description: "Latest Python programming language for AI and robotics development",
      version: "3.11.5",
      size: "45 MB",
      downloads: "1.8M+",
      rating: 4.9,
      platform: ["Windows", "Mac", "Linux"],
      category: "Programming",
      difficulty: "Beginner",
      downloadLink: "https://www.python.org/downloads/",
      official: true,
      featured: true
    },
    {
      id: 3,
      name: "ROS 2 Humble",
      description: "Robot Operating System for advanced robotics applications",
      version: "2.0",
      size: "1.2 GB",
      downloads: "450K+",
      rating: 4.6,
      platform: ["Ubuntu Linux"],
      category: "Framework",
      difficulty: "Advanced",
      downloadLink: "https://docs.ros.org/en/humble/Installation.html",
      official: true
    },
    {
      id: 4,
      name: "Blockly",
      description: "Visual programming editor for beginners and education",
      version: "9.0",
      size: "15 MB",
      downloads: "890K+",
      rating: 4.7,
      platform: ["Web", "Windows", "Mac"],
      category: "Education",
      difficulty: "Beginner",
      downloadLink: "https://developers.google.com/blockly",
      official: true
    },
    {
      id: 5,
      name: "FreeCAD",
      description: "Open-source 3D CAD modeler for robot design",
      version: "0.21",
      size: "680 MB",
      downloads: "320K+",
      rating: 4.4,
      platform: ["Windows", "Mac", "Linux"],
      category: "Design",
      difficulty: "Intermediate",
      downloadLink: "https://www.freecad.org/downloads.php",
      official: true
    },
    {
      id: 6,
      name: "Blender",
      description: "3D creation suite for animation and simulation",
      version: "3.6",
      size: "250 MB",
      downloads: "1.2M+",
      rating: 4.8,
      platform: ["Windows", "Mac", "Linux"],
      category: "Design",
      difficulty: "Intermediate",
      downloadLink: "https://www.blender.org/download/",
      official: true
    },
    {
      id: 7,
      name: "MATLAB Robotics Toolbox",
      description: "Powerful toolbox for robotics algorithm development",
      version: "R2023b",
      size: "2.1 GB",
      downloads: "180K+",
      rating: 4.5,
      platform: ["Windows", "Mac", "Linux"],
      category: "Simulation",
      difficulty: "Advanced",
      downloadLink: "https://www.mathworks.com/products/robotics.html",
      official: true
    },
    {
      id: 8,
      name: "VSCode",
      description: "Lightweight code editor with robotics extensions",
      version: "1.85",
      size: "85 MB",
      downloads: "3.1M+",
      rating: 4.9,
      platform: ["Windows", "Mac", "Linux"],
      category: "Programming",
      difficulty: "All Levels",
      downloadLink: "https://code.visualstudio.com/download",
      official: true,
      featured: true
    }
  ];

  // Free Books Resources
  const bookResources = [
    {
      id: 1,
      title: "Robotics Programming 101",
      author: "Dr. Sarah Chen",
      description: "Complete beginner's guide to robotics programming with Python and Arduino",
      pages: 320,
      level: "Beginner",
      format: "PDF",
      size: "45 MB",
      downloads: "150K+",
      category: "Programming",
      downloadLink: "#",
      featured: true,
      cover: "/images/book-robotics-101.jpg"
    },
    {
      id: 2,
      title: "AI & Machine Learning for Robotics",
      author: "Prof. Alex Rodriguez",
      description: "Advanced concepts in AI and ML applications for autonomous robots",
      pages: 480,
      level: "Advanced",
      format: "PDF",
      size: "68 MB",
      downloads: "89K+",
      category: "AI/ML",
      downloadLink: "#",
      featured: true,
      cover: "/images/book-ai-robotics.jpg"
    },
    {
      id: 3,
      title: "Robot Mechanics & Design",
      author: "Engineering Team",
      description: "Fundamentals of robot mechanics, kinematics and structural design",
      pages: 380,
      level: "Intermediate",
      format: "PDF",
      size: "52 MB",
      downloads: "112K+",
      category: "Mechanics",
      downloadLink: "#",
      cover: "/images/book-robot-mechanics.jpg"
    },
    {
      id: 4,
      title: "Computer Vision for Robotics",
      author: "Dr. Michael Zhang",
      description: "Implementing computer vision algorithms for robot perception",
      pages: 420,
      level: "Intermediate",
      format: "PDF",
      size: "61 MB",
      downloads: "76K+",
      category: "Vision",
      downloadLink: "#",
      cover: "/images/book-computer-vision.jpg"
    }
  ];

  // Mobile Apps Resources
  const appResources = [
    {
      id: 1,
      name: "Arduino Bluetooth Controller",
      description: "Control your Arduino projects via Bluetooth from your phone",
      platform: ["Android", "iOS"],
      size: "28 MB",
      downloads: "500K+",
      rating: 4.5,
      category: "Control",
      downloadLink: "https://play.google.com/store/apps/details?id=com.arduino.controller",
      featured: true
    },
    {
      id: 2,
      name: "Python Tutorial - Learn Python",
      description: "Interactive Python learning app with robotics examples",
      platform: ["Android", "iOS"],
      size: "35 MB",
      downloads: "1.2M+",
      rating: 4.7,
      category: "Learning",
      downloadLink: "https://play.google.com/store/apps/details?id=com.python.tutorial",
      featured: true
    },
    {
      id: 3,
      name: "Robot Simulator 3D",
      description: "3D robot simulation and programming environment",
      platform: ["Android", "iOS"],
      size: "120 MB",
      downloads: "250K+",
      rating: 4.3,
      category: "Simulation",
      downloadLink: "https://play.google.com/store/apps/details?id=com.robot.simulator"
    },
    {
      id: 4,
      name: "Blockly Games - Learn Coding",
      description: "Visual programming games to learn coding concepts",
      platform: ["Android", "iOS"],
      size: "45 MB",
      downloads: "890K+",
      rating: 4.6,
      category: "Education",
      downloadLink: "https://play.google.com/store/apps/details?id=com.blockly.games"
    }
  ];

  // Tutorial Resources
  const tutorialResources = [
    {
      id: 1,
      title: "Arduino Beginner to Advanced",
      instructor: "Robotics Academy",
      duration: "8 hours",
      videos: 45,
      level: "Beginner",
      students: "125K+",
      rating: 4.8,
      category: "Programming",
      thumbnail: "/images/tutorial-arduino.jpg",
      watchLink: "#",
      featured: true
    },
    {
      id: 2,
      title: "Build Your First Robot",
      instructor: "Maker Studio",
      duration: "6 hours",
      videos: 32,
      level: "Beginner",
      students: "98K+",
      rating: 4.7,
      category: "Building",
      thumbnail: "/images/tutorial-first-robot.jpg",
      watchLink: "#",
      featured: true
    },
    {
      id: 3,
      title: "AI Robotics with Python",
      instructor: "AI Masters",
      duration: "12 hours",
      videos: 68,
      level: "Advanced",
      students: "45K+",
      rating: 4.9,
      category: "AI/ML",
      thumbnail: "/images/tutorial-ai-robotics.jpg",
      watchLink: "#"
    }
  ];

  // Quick Stats
  const stats = [
    { number: "500+", label: "Free Resources" },
    { number: "2M+", label: "Downloads" },
    { number: "4.8/5", label: "Average Rating" },
    { number: "100%", label: "Free Forever" }
  ];

  // Filter resources based on search
  const filteredSoftware = softwareResources.filter(software =>
    software.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    software.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBooks = bookResources.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApps = appResources.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutorials = tutorialResources.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentResources = () => {
    switch (activeCategory) {
      case "software": return filteredSoftware;
      case "books": return filteredBooks;
      case "apps": return filteredApps;
      case "tutorials": return filteredTutorials;
      default: return filteredSoftware;
    }
  };

  type Resource = any;

  const ResourceCard = ({ resource, type }: { resource: Resource; type: string }) => {
    if (type === "software") {
      return (
        <Card className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{resource.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      v{resource.version}
                    </Badge>
                    {resource.featured && (
                      <Badge className="bg-amber-500 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {resource.official && (
                <Badge variant="outline" className="border-green-500 text-green-700">
                  Official
                </Badge>
              )}
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{resource.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Database className="h-3 w-3" />
                  Size: {resource.size}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Download className="h-3 w-3" />
                  {resource.downloads}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3 w-3 text-amber-500" />
                  {resource.rating} Rating
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield className="h-3 w-3 text-green-500" />
                  {resource.difficulty}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {resource.platform.map((platform: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
              <a href={resource.downloadLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (type === "books") {
      return (
        <Card className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-20 h-28 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg truncate">{resource.title}</h3>
                    <p className="text-gray-600 text-sm">by {resource.author}</p>
                  </div>
                  {resource.featured && (
                    <Badge className="bg-amber-500 text-white text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">{resource.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText className="h-3 w-3" />
                    {resource.pages} pages
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Database className="h-3 w-3" />
                    {resource.size}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Download className="h-3 w-3" />
                    {resource.downloads}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <GraduationCap className="h-3 w-3" />
                    {resource.level}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {resource.category}
                  </Badge>
                  <a href={resource.downloadLink}>
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (type === "apps") {
      return (
        <Card className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{resource.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-3 w-3 text-amber-500" />
                      {resource.rating}
                    </div>
                    {resource.featured && (
                      <Badge className="bg-amber-500 text-white text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{resource.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Database className="h-3 w-3" />
                  Size: {resource.size}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Download className="h-3 w-3" />
                  {resource.downloads}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                {resource.platform.map((platform: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {resource.category}
              </Badge>
              <a href={resource.downloadLink} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Download className="h-4 w-4 mr-1" />
                  Get App
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (type === "tutorials") {
      return (
        <Card className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-24 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg truncate">{resource.title}</h3>
                    <p className="text-gray-600 text-sm">by {resource.instructor}</p>
                  </div>
                  {resource.featured && (
                    <Badge className="bg-amber-500 text-white text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-3 text-sm leading-relaxed">Complete video course with {resource.videos} lessons</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {resource.duration}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Video className="h-3 w-3" />
                    {resource.videos} videos
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    {resource.students}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="h-3 w-3 text-amber-500" />
                    {resource.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {resource.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                  <a href={resource.watchLink}>
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Watch Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-200 to-blue-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-300 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-7xl relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg mb-4">
                <Sparkles className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-semibold text-gray-700">Free Robotics Resources</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  LEARN
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  & BUILD FREE
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Access our complete collection of free software, books, apps, and tutorials. 
              <span className="bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent font-bold"> Everything you need to start your robotics journey.</span>
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Resources Section */}
      <section className="px-4 py-16 md:px-6 md:py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={`rounded-xl px-6 py-4 font-semibold transition-all duration-300 ${
                    activeCategory === category.id 
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                      : "border-2 border-gray-300 hover:border-cyan-500 bg-white"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${categories.find(c => c.id === activeCategory)?.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Active Category Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {categories.find(c => c.id === activeCategory)?.description}
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getCurrentResources().map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                type={activeCategory}
              />
            ))}
          </div>

          {/* Empty State */}
          {getCurrentResources().length === 0 && (
            <div className="text-center py-16">
              <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or browse other categories</p>
              <Button 
                onClick={() => setSearchQuery('')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Load More */}
          {getCurrentResources().length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="rounded-full border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-cyan-500 hover:bg-cyan-50">
                Load More Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-20 md:px-6 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-4xl text-center relative">
          <Zap className="h-16 w-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Start Your Robotics Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Download our free resources and begin building amazing robots. No cost, no limits - just pure learning and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="rounded-full bg-white text-cyan-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <Download className="mr-2 h-5 w-5" />
              DOWNLOAD STARTER KIT
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-white text-white hover:bg-white hover:text-cyan-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              VIEW ALL TUTORIALS
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}