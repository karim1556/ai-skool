"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Building,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Package,
  BookOpen,
  Target,
  Heart,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  ChevronRight,
  Play,
  ShoppingCart,
  Share2,
  Quote
} from "lucide-react";
import { useState } from "react";
import { Bebas_Neue } from "next/font/google";
import { useCart } from "@/hooks/use-cart";

// Load condensed font
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function FranchisePage() {
  const { addItem } = useCart();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Franchise locations data
  const franchiseLocations = [
    {
      region: "Europe",
      countries: ["Germany", "Austria"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      region: "Africa",
      countries: ["Lebanon", "Kierra", "DRC", "Anglia", "Tanzania", "Natalia", "Bocquata", "Zimbache", "Seda Africa"],
      color: "from-green-500 to-emerald-500"
    },
    {
      region: "Middle East & Asia",
      countries: ["Amendabad", "Mumbai", "Shen", "Jeddah", "Ranggal"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      region: "India & Southeast Asia",
      countries: ["Dabadan", "Delhi", "Oswalud", "Iroku", "Jamadogu", "Kolkata", "Apertah", "Hovrah", "Kahaba", "Yaman", "Thanjar", "Malaysia"],
      color: "from-orange-500 to-amber-500"
    },
    {
      region: "South Asia",
      countries: ["Votap", "Madras Isanaba"],
      color: "from-red-500 to-pink-500"
    },
    {
      region: "Indian Ocean",
      countries: ["Mauritius", "Malagascar", "Conosco", "Mozambique"],
      color: "from-teal-500 to-cyan-500"
    },
    {
      region: "Australia",
      countries: ["Sydney"],
      color: "from-yellow-500 to-orange-500"
    }
  ];

  // Value propositions for franchise partners
  const franchiseValues = [
    {
      title: "Marketing Support",
      description: "Complete support for Digital marketing activities like managing Campaigns, SEO, Lead Generation, Graphic Designing & Branding.",
      icon: Target,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Technical Expertise & Support",
      description: "Technical support by providing training to partners and trainers with STEM Certified curricula & courses.",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Collaborations & Teamwork",
      description: "Work with a tech community of partners & trainers to share ideas, build projects, and discuss challenges & solutions.",
      icon: Users,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Learning Management System",
      description: "Complete tool to manage day-to-day activities for student lead management, registration, performance, certificates & more.",
      icon: BookOpen,
      gradient: "from-orange-500 to-amber-500"
    },
    {
      title: "Experience & Credibility",
      description: "Since 2018 with 50,000+ years of Training, 50,000+ students & 15+ Franchise partners with global presence.",
      icon: Award,
      gradient: "from-red-500 to-pink-500"
    }
  ];

  // Unique selling points
  const uniqueSellingPoints = [
    {
      title: "Extensive Training",
      description: "Comprehensive training programs covering all aspects of robotics and AI education",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Diverse Course Offerings",
      description: "Wide range of courses for different age groups and skill levels",
      icon: Package,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Qualified Team",
      description: "Expert trainers and support staff with industry experience",
      icon: Users,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Strong Support",
      description: "24/7 technical and operational support for all franchise partners",
      icon: Shield,
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  // Who can apply
  const applicantTypes = [
    {
      type: "Passionate Individual / Entrepreneur",
      description: "Individuals passionate about technology and education looking to start their own business",
      icon: Heart,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      type: "Tutors / Coaching Centers",
      description: "Existing educational service providers looking to expand their offerings",
      icon: Users,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      type: "Educational Centers With Existing Student Base",
      description: "Schools and institutions wanting to add robotics and AI to their curriculum",
      icon: Building,
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  // Growth reasons
  const growthReasons = [
    {
      reason: "Edu Tech Growth",
      description: "Edu Tech is one of the fastest growing sectors in the world",
      stat: "Fastest Growing"
    },
    {
      reason: "Future Job Market",
      description: "80-90% jobs in next few years will be related to Robotics, AI & ML",
      stat: "80-90% Jobs"
    },
    {
      reason: "Increasing Demand",
      description: "Demand from school/college students and professionals alike",
      stat: "All Ages"
    },
    {
      reason: "Huge Market Opportunity",
      description: "Millions of students interested with less than 1% demand addressed",
      stat: "<1% Addressed"
    },
    {
      reason: "Government Initiatives",
      description: "NITI Aayog promoting Robotics/STEM to create 1M Neoteric Innovators",
      stat: "1M Innovators"
    }
  ];

  // Technology trends
  const technologyTrends = [
    { name: "Robotics", growth: "high" },
    { name: "AI & ML", growth: "very-high" },
    { name: "IOT", growth: "high" },
    { name: "3D Printing", growth: "medium" },
    { name: "Mixed Reality", growth: "medium" },
    { name: "Block Chain", growth: "medium" },
    { name: "Data Analytic", growth: "high" }
  ];

  // Franchise comparison
  const franchiseComparison = [
    {
      type: "Robotics Franchise",
      description: "Offers holistic knowledge of Mechanics, Electronics, Coding & Microcontrollers",
      advantages: ["Hardware + Software", "Comprehensive", "Hands-on Learning"],
      bestFor: "Complete STEM Education"
    },
    {
      type: "Coding Franchise",
      description: "Focuses on programming skills with software-based courses like HTML, C++, Python",
      advantages: ["Software Focus", "Programming Skills", "Digital Projects"],
      limitations: ["No Hardware", "Limited Scope"]
    },
    {
      type: "AI Franchise",
      description: "Includes AI-based courses like image processing, classification using Python",
      advantages: ["AI Specialization", "Advanced Topics", "Python Focus"],
      limitations: ["Narrow Focus", "Requires Base Knowledge"]
    },
    {
      type: "STEM Franchise",
      description: "Includes practical concepts of science, technology, engineering, and math",
      advantages: ["Broad Curriculum", "Science Focus", "Diverse Projects"],
      limitations: ["Less Technical", "Basic Level"]
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "What is the initial investment required?",
      answer: "The initial investment varies based on location and scale, typically ranging from $10,000 to $50,000 including setup, training, and initial inventory."
    },
    {
      question: "How much training is provided?",
      answer: "We provide comprehensive training spanning 2-4 weeks covering technical skills, business operations, marketing, and student management."
    },
    {
      question: "What ongoing support is available?",
      answer: "24/7 technical support, regular curriculum updates, marketing assistance, and quarterly training sessions for continuous improvement."
    },
    {
      question: "What is the typical ROI period?",
      answer: "Most franchise partners break even within 12-18 months and achieve full ROI within 2-3 years depending on location and market conditions."
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
                  Are You Passionate To{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                    Start Your Own Business
                  </span>{" "}
                  in ROBOTICS & AI
                </h1>
                <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
                  Join our global network of successful franchise partners and build the future of education with cutting-edge robotics and AI technology.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/franchise-apply">
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-sky-600 px-10 py-4 text-lg font-bold text-white hover:from-sky-600 hover:to-sky-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                    ENQUIRE NOW
                  </Button>
                </Link>
                <Link href="#franchise-benefits">
                  <Button variant="outline" className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold">
                    LEARN MORE
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-60 blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-sky-200 to-sky-300 opacity-60 blur-xl"></div>
              <div className="relative group">
                <Image
                  src="/images/franchise-hero.jpg"
                  alt="Robotics Franchise Opportunity"
                  width={700}
                  height={500}
                  className="relative z-10 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interested Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                  Interested in Starting{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                    The Right Business ?
                  </span>
                </h2>
                <p className="text-xl font-medium text-gray-700 mb-8">
                  If any of your answer is yes, you have landed to the right place !
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {[
                  "Are you a person driven by Passion, Creativity & Technology ?",
                  "Do you wish to start a business where the growth opportunities are high ?",
                  "Are you looking for an experienced Partner, who knows the market and can Support you well with their Technical & Marketing skills ?",
                  "Do you already have an existing educational business and want to give it a competitive advantage ?"
                ].map((question, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-2xl shadow-lg">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900 tracking-tight">{question}</span>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Button className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-10 py-4 text-lg font-bold text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-xl">
                  YES! I'M INTERESTED
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Franchise Comparison */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              What's the difference between{" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                Robotics, Coding, AI Or STEM
              </span>{" "}
              based Franchise Business?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {franchiseComparison.map((franchise, index) => (
              <Card
                key={index}
                className={`group border-2 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  franchise.type === "Robotics Franchise" 
                    ? "border-sky-300 shadow-2xl" 
                    : "border-gray-200 shadow-lg"
                }`}
              >
                {franchise.type === "Robotics Franchise" && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">RECOMMENDED</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{franchise.type}</h3>
                  <p className="text-gray-600 mb-4 text-sm tracking-tight">{franchise.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-semibold text-green-600">Advantages:</div>
                    {franchise.advantages.map((adv, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 tracking-tight">{adv}</span>
                      </div>
                    ))}
                  </div>

                  {franchise.limitations && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-orange-600">Limitations:</div>
                      {franchise.limitations.map((lim, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full border border-orange-500 flex items-center justify-center flex-shrink-0">
                            <div className="h-1 w-1 bg-orange-500 rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-700 tracking-tight">{lim}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {franchise.bestFor && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-semibold text-blue-700">Best For: {franchise.bestFor}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Demand Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-8">
                Growing Demand of Robotics Franchise in{" "}
                <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                  India and Worldwide
                </span>
              </h2>
              
              <div className="space-y-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  5 Reasons Why It's The Best Time to Start A Business in Robotics & AI
                </h3>
                
                <div className="space-y-4">
                  {growthReasons.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-lg">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-gray-900 tracking-tight">{reason.reason}</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {reason.stat}
                          </Badge>
                        </div>
                        <p className="text-gray-600 tracking-tight">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight text-center">
                Technology Growth Trends 2020-2035
              </h3>
              
              <div className="space-y-4">
                {technologyTrends.map((tech, index) => (
                  <div key={index} className="bg-white p-4 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 tracking-tight">{tech.name}</span>
                      <Badge className={
                        tech.growth === "very-high" ? "bg-green-500" :
                        tech.growth === "high" ? "bg-blue-500" : "bg-purple-500"
                      }>
                        {tech.growth === "very-high" ? "Very High" :
                         tech.growth === "high" ? "High" : "Medium"} Growth
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        tech.growth === "very-high" ? "bg-green-500 w-4/5" :
                        tech.growth === "high" ? "bg-blue-500 w-3/4" : "bg-purple-500 w-2/3"
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-sky-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                <h4 className="text-xl font-bold mb-2">Market Projection</h4>
                <p className="text-sky-100">
                  Robotics education market expected to grow 300% by 2030
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Who can Apply for the{" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                Robotics Franchise ?
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {applicantTypes.map((applicant, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="space-y-6 p-0">
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${applicant.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <applicant.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{applicant.type}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium tracking-tight">{applicant.description}</p>
                  <Button variant="outline" className="rounded-full border-2 border-gray-300">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Selling Points */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Our Unique Selling Point
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {uniqueSellingPoints.map((usp, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="space-y-6 p-0">
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${usp.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <usp.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">{usp.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium tracking-tight text-sm">{usp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Values */}
      <section id="franchise-benefits" className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              What value do we bring to our{" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                Robotics Franchise Partners ?
              </span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {franchiseValues.map((value, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="space-y-6 p-0">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${value.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium tracking-tight text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Locations */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Our Robotics Franchisee{" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                Locations
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Join our growing global network of successful franchise partners
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {franchiseLocations.map((location, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/80 backdrop-blur-sm p-6 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="p-0">
                  <div className={`h-2 rounded-t-lg bg-gradient-to-r ${location.color} mb-4`}></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{location.region}</h3>
                  <div className="space-y-2">
                    {location.countries.map((country, countryIndex) => (
                      <div key={countryIndex} className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 font-medium tracking-tight">{country}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-4xl">
          <Card className="border-0 bg-gradient-to-br from-sky-50 to-blue-100 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Quote className="h-12 w-12 text-sky-500 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
                  "The support and training provided by the franchise team helped me establish a successful robotics center within 6 months. The curriculum is excellent and students love the hands-on approach."
                </p>
                <div>
                  <div className="text-lg font-bold text-gray-900 tracking-tight">Angshuman Das</div>
                  <div className="text-gray-600">Franchise Partner, Delhi</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="overflow-hidden rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg tracking-tight">{faq.question}</span>
                  {activeFaq === index ? (
                    <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center">
                      <div className="h-0.5 w-2 bg-white"></div>
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-sky-500 flex items-center justify-center">
                      <div className="h-0.5 w-2 bg-sky-500"></div>
                      <div className="w-0.5 h-2 bg-sky-500 absolute rotate-90"></div>
                    </div>
                  )}
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 tracking-tight">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-4xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Start Your Robotics Franchise?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto tracking-tight">
            Join our global network of successful franchise partners and build a future-proof business in robotics education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/franchise-apply">
              <Button 
                size="lg"
                className="rounded-full bg-white text-sky-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-xl tracking-tight"
              >
                Apply for Franchise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-sky-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200 tracking-tight"
              >
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}