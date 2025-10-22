"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  Award,
  BookOpen,
  Building,
  Settings,
  Cpu,
  Bot,
  GraduationCap,
  Shield,
  Zap,
  Brain,
  Trophy,
  Star,
  CheckCircle,
  Target,
  Lightbulb,
  Sparkles,
  Rocket,
  Globe,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<string>("teacher-training");

  // Main services data
  const mainServices = [
    {
      id: "teacher-training",
      title: "Teacher Training & Certification",
      description: "Comprehensive certification programs to transform educators into robotics and AI experts",
      icon: GraduationCap,
      gradient: "from-blue-500 to-purple-600",
      route: "/teachers-training",
      features: [
        "Industry-recognized certifications",
        "Hands-on training programs",
        "Curriculum development",
        "Ongoing support"
      ],
      stats: [
        { number: "500+", label: "Teachers Certified" },
        { number: "95%", label: "Success Rate" },
        { number: "4.9/5", label: "Rating" }
      ],
      image: "/images/teacher-training-service.jpg",
      cta: "Become Certified"
    },
    {
      id: "lab-setup",
      title: "Robotics & AI Lab Setup",
      description: "Complete turnkey solutions for setting up state-of-the-art robotics laboratories in educational institutions",
      icon: Cpu,
      gradient: "from-green-500 to-emerald-600",
      route: "/lab-setup",
      features: [
        "Customized lab design",
        "Latest equipment & kits",
        "Infrastructure planning",
        "Teacher training included"
      ],
      stats: [
        { number: "50+", label: "Schools Partnered" },
        { number: "100%", label: "Satisfaction Rate" },
        { number: "24/7", label: "Support" }
      ],
      image: "/images/lab-setup-service.jpg",
      cta: "Setup Lab"
    },
    {
      id: "franchise",
      title: "Franchise Opportunities",
      description: "Start your own successful robotics and AI education business with our proven franchise model",
      icon: Building,
      gradient: "from-orange-500 to-amber-600",
      route: "/franchise",
      features: [
        "Global franchise network",
        "Complete business support",
        "Marketing assistance",
        "Technical expertise"
      ],
      stats: [
        { number: "15+", label: "Countries" },
        { number: "50K+", label: "Students" },
        { number: "300%", label: "Growth" }
      ],
      image: "/images/franchise-service.jpg",
      cta: "Join Network"
    }
  ];

  // Why choose us features
  const whyChooseUs = [
    {
      icon: Award,
      title: "Industry Recognition",
      description: "Globally recognized certifications and partnerships",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Proven Track Record",
      description: "Successfully implemented in 50+ institutions worldwide",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified trainers and industry professionals",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Cutting-Edge Technology",
      description: "Latest robotics and AI equipment and curriculum",
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: "Consultation",
      description: "Understand your requirements and goals",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      step: 2,
      title: "Customization",
      description: "Tailor solutions to your specific needs",
      icon: Settings,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      step: 3,
      title: "Implementation",
      description: "Execute the plan with expert guidance",
      icon: Rocket,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      step: 4,
      title: "Support",
      description: "Ongoing assistance and updates",
      icon: Lightbulb,
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-300 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-7xl relative">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg mb-6">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-bold text-gray-700 tracking-wider">COMPREHENSIVE SOLUTIONS</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                TRANSFORM
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                EDUCATION
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed max-w-4xl mx-auto tracking-tight">
              Empowering educational institutions, teachers, and entrepreneurs with cutting-edge 
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold"> Robotics & AI solutions</span> for the future
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="#services">
                <Button className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-12 py-6 text-lg font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl">
                  EXPLORE SERVICES
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="rounded-full border-2 border-gray-300 px-12 py-6 text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all">
                  CONSULT EXPERT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 px-6 py-3 text-sm mb-6 rounded-2xl border-0 shadow-lg">
              <Target className="h-5 w-5 mr-2" />
              OUR SERVICES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Comprehensive <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Robotics & AI Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              End-to-end solutions designed to revolutionize education through robotics and artificial intelligence
            </p>
          </div>

          {/* Service Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {mainServices.map((service) => {
              const Icon = service.icon;
              return (
                <Button
                  key={service.id}
                  variant={activeService === service.id ? "default" : "outline"}
                  onClick={() => setActiveService(service.id)}
                  className={`rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                    activeService === service.id 
                      ? `bg-gradient-to-r ${service.gradient} text-white shadow-2xl` 
                      : "border-2 border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {service.title.split(" ")[0]}
                </Button>
              );
            })}
          </div>

          {/* Active Service Details */}
          {mainServices.map((service) => {
            const Icon = service.icon;
            if (service.id !== activeService) return null;
            
            return (
              <div key={service.id} className="grid gap-12 lg:grid-cols-2 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-2xl`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-900">What's Included:</h4>
                      <div className="grid gap-3">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 pt-6">
                      {service.stats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={service.route}>
                      <Button className={`rounded-full bg-gradient-to-r ${service.gradient} px-10 py-4 text-lg font-bold text-white hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                        {service.cta}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold">
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="relative z-10 rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All Services Grid */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 px-6 py-3 text-sm mb-6 rounded-2xl border-0 shadow-lg">
              <Globe className="h-5 w-5 mr-2" />
              ALL SOLUTIONS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Choose Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Transformation Path</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {mainServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg overflow-hidden relative"
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
                  <div className="absolute inset-[2px] bg-white rounded-2xl"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="text-center space-y-6">
                      {/* Icon */}
                      <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r ${service.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                          {service.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        {service.stats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="text-lg font-bold text-gray-900">{stat.number}</div>
                            <div className="text-xs text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link href={service.route}>
                        <Button 
                          variant="outline" 
                          className="w-full rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-blue-50/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 px-6 py-3 text-sm mb-6 rounded-2xl border-0 shadow-lg">
              <Star className="h-5 w-5 mr-2" />
              WHY CHOOSE US
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              The <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Mechatron Advantage</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our comprehensive approach to robotics and AI education
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <CardContent className="space-y-6 p-0">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 px-6 py-3 text-sm mb-6 rounded-2xl border-0 shadow-lg">
              <Rocket className="h-5 w-5 mr-2" />
              OUR PROCESS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              How We <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Deliver Excellence</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group text-center">
                  <Card className="border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg h-full">
                    <CardContent className="space-y-6 p-0">
                      {/* Step Number */}
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white text-2xl font-bold shadow-2xl">
                        {step.step}
                      </div>
                      
                      {/* Icon */}
                      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Connecting Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-r from-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-4xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Transform Education with Robotics & AI?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of institutions and educators who have revolutionized learning with our comprehensive solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                GET STARTED TODAY
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#services">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-12 py-6 text-lg font-semibold transition-all duration-200"
              >
                EXPLORE ALL SERVICES
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}