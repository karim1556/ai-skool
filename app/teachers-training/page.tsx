"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Award,
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
  Download,
  ArrowRight,
  Zap,
  Brain,
  Cpu,
  Bot,
  GraduationCap,
  Shield,
  Target,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowDown,
  Sparkles,
  Trophy,
  BookMarked,
  Lightbulb,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function TeacherTrainingPage() {
  const [activeTab, setActiveTab] = useState("programs");

  // Training Programs
  const trainingPrograms = [
    {
      id: 1,
      title: "Robotics & AI Master Trainer Program",
      description: "Comprehensive certification program to become a certified robotics and AI educator",
      duration: "6 Weeks",
      level: "Advanced",
      format: "Online + Hands-on",
      certification: "Mechatron Certified Trainer",
      image: "/images/teacher-training-1.jpg",
      features: [
        "Curriculum Development Training",
        "Hands-on Project Guidance",
        "Student Assessment Methods",
        "Classroom Management for STEM",
        "Industry Best Practices"
      ],
      price: "₹15,999",
      originalPrice: "₹24,999",
      popular: true
    },
    {
      id: 2,
      title: "STEM Education Specialist",
      description: "Specialized training in STEM teaching methodologies and project-based learning",
      duration: "4 Weeks",
      level: "Intermediate",
      format: "Online",
      certification: "STEM Education Specialist",
      image: "/images/teacher-training-2.jpg",
      features: [
        "Project-Based Learning Methods",
        "STEM Curriculum Design",
        "Interactive Teaching Techniques",
        "Assessment Strategies",
        "Technology Integration"
      ],
      price: "₹12,999",
      originalPrice: "₹18,999",
      popular: false
    },
    {
      id: 3,
      title: "Arduino & Electronics Trainer",
      description: "Master Arduino programming and electronics for effective classroom teaching",
      duration: "3 Weeks",
      level: "Beginner",
      format: "Hybrid",
      certification: "Arduino Certified Educator",
      image: "/images/teacher-training-3.jpg",
      features: [
        "Arduino Programming Fundamentals",
        "Circuit Design & Prototyping",
        "Sensor Integration",
        "Project Development",
        "Troubleshooting Techniques"
      ],
      price: "₹9,999",
      originalPrice: "₹14,999",
      popular: true
    }
  ];

  // Certification Benefits
  const certificationBenefits = [
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Globally recognized certification validating your expertise in robotics education"
    },
    {
      icon: Users,
      title: "Career Advancement",
      description: "Higher placement opportunities and better career growth in STEM education"
    },
    {
      icon: BookOpen,
      title: "Curriculum Access",
      description: "Access to exclusive curriculum materials and teaching resources"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Assurance of teaching quality and student learning outcomes"
    }
  ];

  // Training Process Steps
  const trainingProcess = [
    {
      step: 1,
      title: "Enrollment & Assessment",
      description: "Register for the program and complete initial skill assessment",
      duration: "1 Week",
      icon: BookMarked
    },
    {
      step: 2,
      title: "Theoretical Training",
      description: "Comprehensive online modules covering concepts and methodologies",
      duration: "2-3 Weeks",
      icon: Brain
    },
    {
      step: 3,
      title: "Hands-on Workshops",
      description: "Practical sessions with robotics kits and teaching simulations",
      duration: "1-2 Weeks",
      icon: Wrench
    },
    {
      step: 4,
      title: "Teaching Practice",
      description: "Conduct demo classes with feedback from master trainers",
      duration: "1 Week",
      icon: Users
    },
    {
      step: 5,
      title: "Certification Exam",
      description: "Final assessment and certification examination",
      duration: "1 Week",
      icon: Trophy
    },
    {
      step: 6,
      title: "Ongoing Support",
      description: "Continuous professional development and community access",
      duration: "Lifetime",
      icon: Lightbulb
    }
  ];

  // Success Stories
  const successStories = [
    {
      name: "Dr. Priya Sharma",
      school: "Delhi Public School",
      role: "Computer Science Teacher",
      image: "/images/teacher-1.jpg",
      story: "The Robotics Master Trainer program transformed my teaching approach. My students are now building complex robots and winning competitions!",
      achievement: "50+ Students Trained | 3 Competition Wins"
    },
    {
      name: "Rahul Verma",
      school: "St. Mary's Convent",
      role: "STEM Coordinator",
      image: "/images/teacher-2.jpg",
      story: "The certification helped me start a robotics club that now has 100+ students. Our school's STEM program is now the best in the city.",
      achievement: "Robotics Club Founder | 100+ Students"
    },
    {
      name: "Anita Desai",
      school: "Kendriya Vidyalaya",
      role: "Physics Teacher",
      image: "/images/teacher-3.jpg",
      story: "The hands-on training approach made complex concepts easy to teach. My students' understanding of physics has improved dramatically.",
      achievement: "Improved Student Performance | 80% Better Results"
    }
  ];

  // Upcoming Batches
  const upcomingBatches = [
    {
      id: 1,
      program: "Robotics & AI Master Trainer",
      startDate: "March 15, 2025",
      endDate: "April 26, 2025",
      schedule: "Weekends (Sat-Sun)",
      timing: "10:00 AM - 1:00 PM",
      seats: "15/25",
      status: "Filling Fast"
    },
    {
      id: 2,
      program: "STEM Education Specialist",
      startDate: "March 22, 2025",
      endDate: "April 19, 2025",
      schedule: "Weekdays (Mon-Wed-Fri)",
      timing: "6:00 PM - 8:00 PM",
      seats: "8/20",
      status: "Available"
    },
    {
      id: 3,
      program: "Arduino & Electronics Trainer",
      startDate: "April 5, 2025",
      endDate: "April 26, 2025",
      schedule: "Weekends (Sat-Sun)",
      timing: "2:00 PM - 5:00 PM",
      seats: "12/20",
      status: "Filling Fast"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Hero Section */}
    {/* Hero Section */}
<section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 px-4 py-20 md:px-6 md:py-28">
  {/* Animated Background Blobs */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-300 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-100/20 via-transparent to-purple-100/10 rounded-full blur-3xl animate-pulse-slow"></div>
  </div>

  <div className="mx-auto max-w-7xl relative z-10">
    <div className="grid items-center gap-16 lg:grid-cols-2">
      
      {/* Left Content */}
      <div className="space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200 shadow-md">
          <GraduationCap className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">Teacher Training & Certification</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              TRAIN
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              THE TRAINER
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
            Empower your teaching career with cutting-edge robotics & AI training programs.{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
              Get certified. Get recognized. Get ahead.
            </span>
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap gap-8 py-6">
          {[
            { number: "500+", label: "Teachers Certified" },
            { number: "95%", label: "Success Rate" },
            { number: "50+", label: "Schools Partnered" },
            { number: "4.9/5", label: "Rating" }
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center transform transition-all duration-300 hover:scale-110"
            >
              <div className="text-4xl font-bold text-gray-900 drop-shadow-sm">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="#programs">
            <Button className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-10 py-4 text-lg font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
              VIEW PROGRAMS
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#contact">
            <Button
              variant="outline"
              className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              <Phone className="mr-2 h-5 w-5" />
              CONSULT EXPERT
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="relative group">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-60 blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-sky-200 to-sky-300 opacity-60 blur-xl"></div>

        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-3xl">
          <Image
            src="/images/teacher-training-hero.jpg"
            alt="Teacher Training Program"
            width={700}
            height={500}
            className="rounded-[2rem] object-cover transition-transform duration-500 group-hover:rotate-1 group-hover:scale-105"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent" />
        </div>

        {/* Floating Badge */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 animate-bounce-slow">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-gray-700">Enrollments Open</span>
        </div>
      </div>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center animate-bounce">
      <ArrowDown className="h-6 w-6" />
      <span className="text-xs font-medium">Scroll to explore</span>
    </div>
  </div>
</section>


      {/* Why Certify Section */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm mb-4">
              <Shield className="h-4 w-4 mr-1" />
              WHY GET CERTIFIED?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Transform Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Teaching Career</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stand out in the competitive education field with industry-recognized certifications in robotics and AI education
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {certificationBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <CardContent className="space-y-6 p-0">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium tracking-tight text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section id="programs" className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm mb-4">
              <BookOpen className="h-4 w-4 mr-1" />
              TRAINING PROGRAMS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Choose Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Certification Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training programs designed specifically for educators and trainers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trainingPrograms.map((program) => (
              <Card key={program.id} className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  {/* Program Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Popular Badge */}
                    {program.popular && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-amber-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          MOST POPULAR
                        </Badge>
                      </div>
                    )}

                    {/* Certification Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        CERTIFIED
                      </Badge>
                    </div>
                  </div>

                  {/* Program Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">{program.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
                    </div>

                    {/* Program Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <span>{program.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>{program.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="font-semibold">{program.certification}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Program Includes:</h4>
                      <div className="space-y-1">
                        {program.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">{program.price}</span>
                          <span className="text-lg text-gray-400 line-through">{program.originalPrice}</span>
                        </div>
                        <div className="text-xs text-green-600 font-semibold">Save ₹{parseInt(program.originalPrice.replace('₹', '').replace(',', '')) - parseInt(program.price.replace('₹', '').replace(',', ''))}</div>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Process */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-blue-50/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-sm mb-4">
              <Target className="h-4 w-4 mr-1" />
              TRAINING PROCESS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Journey to Certification</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step-by-step process designed to ensure comprehensive learning and successful certification
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trainingProcess.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group text-center">
                  <Card className="border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg h-full">
                    <CardContent className="space-y-6 p-0">
                      {/* Step Number */}
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                        {step.step}
                      </div>
                      
                      {/* Icon */}
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed font-medium tracking-tight mb-3">{step.description}</p>
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{step.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Connecting Line (except last) */}
                  {index < trainingProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-amber-100 text-amber-700 px-4 py-2 text-sm mb-4">
              <Trophy className="h-4 w-4 mr-1" />
              SUCCESS STORIES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Hear From Our <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Certified Trainers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from educators who transformed their careers with our certification programs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                <CardContent className="space-y-6 p-0">
                  {/* Teacher Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{story.name}</h3>
                      <p className="text-gray-600 text-sm">{story.role}</p>
                      <p className="text-gray-500 text-xs">{story.school}</p>
                    </div>
                  </div>

                  {/* Story */}
                  <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed italic">"{story.story}"</p>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                        <Award className="h-4 w-4" />
                        {story.achievement}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Batches & CTA */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-r from-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-7xl relative">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Upcoming Batches */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Upcoming Batches</h2>
              <div className="space-y-4">
                {upcomingBatches.map((batch) => (
                  <div key={batch.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-white text-lg">{batch.program}</h3>
                      <Badge className={
                        batch.status === "Filling Fast" ? "bg-amber-500 text-white" : "bg-green-500 text-white"
                      }>
                        {batch.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{batch.startDate} - {batch.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{batch.schedule} | {batch.timing}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                      <span className="text-white/70 text-sm">Seats Available: {batch.seats}</span>
                      <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                        Book Seat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center lg:text-left">
              <GraduationCap className="h-16 w-16 text-white/80 mx-auto lg:mx-0 mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Start Your Certification Journey Today
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Join hundreds of educators who have transformed their teaching careers with our industry-recognized certification programs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    SCHEDULE CALL
                  </Button>
                </Link>
                <Link href="/brochure">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    DOWNLOAD BROCHURE
                  </Button>
                </Link>
              </div>

              {/* Quick Contact */}
              <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <h3 className="text-white font-bold text-lg mb-4">Need Immediate Assistance?</h3>
                <div className="space-y-2 text-white/80">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    <span className="font-semibold">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    <span className="font-semibold">training@mechatron.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}