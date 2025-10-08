"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Settings,
  Cpu,
  Printer,
  Plane,
  Bot,
  Users,
  Award,
  Building,
  School,
  Calendar,
  Package,
  Wrench,
  Lightbulb,
  Star,
  Shield,
  Zap,
  Brain,
  Atom,
  Calculator,
  Sparkles,
  ChevronRight,
  Play,
  Heart,
  Share2,
  ShoppingCart,
  Trophy
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

export default function LabSetupPage() {
  const { addItem } = useCart();
  const [activeStep, setActiveStep] = useState(1);

  // Lab setup steps
  const setupSteps = [
    {
      step: 1,
      title: "Share Your Requirement With Us",
      description: "Based on your requirements & budget we would suggest the best suitable lab for your institution.",
      icon: Settings,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      step: 2,
      title: "Order Your Customized Lab",
      description: "Based on the batch size, order the equipment and kits required for your lab setup.",
      icon: Package,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      step: 3,
      title: "Lab Installation & Setup",
      description: "Our experts will visit your campus and set up the complete Robotics & AI lab with proper infrastructure.",
      icon: Wrench,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      step: 4,
      title: "Teacher Training & Support",
      description: "Comprehensive training for your faculty and ongoing technical support throughout the academic year.",
      icon: Users,
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  // Lab equipment categories
  const equipmentCategories = [
    {
      name: "Arduino Kits",
      description: "Complete Arduino starter kits with sensors, motors, and components",
      icon: Cpu,
      gradient: "from-blue-500 to-cyan-500",
      items: ["Arduino Uno", "Sensors Pack", "Motor Drivers", "Breadboards"]
    },
    {
      name: "3D Printers",
      description: "Professional 3D printers for prototyping and model creation",
      icon: Printer,
      gradient: "from-purple-500 to-indigo-500",
      items: ["FDM Printers", "Filaments", "Slicing Software", "Maintenance Kit"]
    },
    {
      name: "Robot Kits",
      description: "Various robot kits for different age groups and skill levels",
      icon: Bot,
      gradient: "from-green-500 to-emerald-500",
      items: ["Line Following", "Obstacle Avoidance", "Robotic Arm", "Humanoid"]
    },
    {
      name: "Drone Kits",
      description: "Educational drone kits with programming capabilities",
      icon: Plane,
      gradient: "from-orange-500 to-amber-500",
      items: ["Quadcopters", "Programming Drones", "FPV Kits", "Safety Gear"]
    },
    {
      name: "Humanoid Kits",
      description: "Advanced humanoid robots for AI and robotics research",
      icon: Users,
      gradient: "from-red-500 to-pink-500",
      items: ["Bipedal Robots", "AI Vision", "Voice Recognition", "Gesture Control"]
    },
    {
      name: "AI & IoT Kits",
      description: "Artificial Intelligence and Internet of Things development kits",
      icon: Brain,
      gradient: "from-teal-500 to-cyan-500",
      items: ["AI Cameras", "IoT Sensors", "Edge Computing", "Cloud Integration"]
    }
  ];

  // Infrastructure requirements
  const infrastructureRequirements = [
    {
      category: "Basic Setup",
      requirements: [
        "Dedicated classroom space (min. 500 sq ft)",
        "Sturdy work tables and chairs",
        "Adequate electrical outlets",
        "Proper lighting and ventilation"
      ]
    },
    {
      category: "Technology Infrastructure",
      requirements: [
        "High-speed internet connection",
        "Wi-Fi coverage throughout lab",
        "Projector or smart board",
        "Computer systems (1 per 2 students)"
      ]
    },
    {
      category: "Safety & Storage",
      requirements: [
        "Secure storage cabinets",
        "First aid kit",
        "Fire extinguisher",
        "Tool organization system"
      ]
    },
    {
      category: "Additional Facilities",
      requirements: [
        "3D printing area with ventilation",
        "Testing and prototyping zone",
        "Display area for student projects",
        "Charging station for devices"
      ]
    }
  ];

  // Partner schools and colleges
  const partnerInstitutions = {
    schools: [
      "SACRED HEART SCHOOL KHARAGPUR",
      "SUNNY PREP SCHOOL KOLKATA", 
      "DREAM HILL SCHOOL SOUTH AFRICA",
      "S.N.B.P SCHOOL PUNE",
      "KENDRYA VIDYALAYA KOLKATA",
      "GGIS SCHOOL PUNE",
      "LEXICON PUNE",
      "DON BOSCO PUNE"
    ],
    colleges: [
      "MODERA",
      "ST. MIRA'S COLLEGE PUNE", 
      "INDIRA COLLEGE PUNE"
    ],
    foundations: [
      "AMERICAN INDIA FOUNDATION",
      "AMERICAN PROGRAMMING"
    ]
  };

  // Value propositions
  const valuePropositions = [
    {
      title: "Certification of Students",
      description: "Industry-recognized certifications upon course completion",
      icon: Award,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Best in class Training Material & Kits",
      description: "Comprehensive learning materials and high-quality equipment",
      icon: Package,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Courses & Kits for all age groups",
      description: "Curriculum designed for different age levels and skill sets",
      icon: Users,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Participation in Competitions",
      description: "Opportunities to compete in national and international robotics events",
      icon: Trophy,
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  // Lab packages
  const labPackages = [
    {
      name: "Starter Lab",
      price: 4999,
      originalPrice: 6999,
      description: "Perfect for schools starting their robotics journey",
      features: [
        "5 Arduino Starter Kits",
        "Basic Sensor Pack",
        "Teacher Training",
        "Curriculum for 1 Year",
        "Online Support"
      ],
      bestFor: "Elementary & Middle Schools",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Advanced Lab",
      price: 12999,
      originalPrice: 15999,
      description: "Comprehensive setup for serious robotics programs",
      features: [
        "10 Arduino Kits + 3D Printer",
        "Advanced Sensor Collection",
        "Drone Programming Kit",
        "Curriculum for 2 Years",
        "Priority Support",
        "Competition Preparation"
      ],
      bestFor: "High Schools & Colleges",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      name: "Premium Lab",
      price: 24999,
      originalPrice: 29999,
      description: "Complete AI & Robotics innovation center",
      features: [
        "20+ Various Robot Kits",
        "Multiple 3D Printers",
        "Humanoid Robots",
        "AI Vision Systems",
        "5-Year Curriculum",
        "Dedicated Support",
        "National Competition Entry"
      ],
      bestFor: "Universities & Research Centers",
      gradient: "from-orange-500 to-amber-500"
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
                  Upgrade your School with Our{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                    High-Tech ROBOTICS & AI LAB
                  </span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
                  Transform your institution with our customized Robotics & AI laboratories featuring the latest equipment, comprehensive curriculum, and expert support.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-sky-600 px-10 py-4 text-lg font-bold text-white hover:from-sky-600 hover:to-sky-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                    GET FREE CONSULTATION
                  </Button>
                </Link>
                <Link href="#lab-packages">
                  <Button variant="outline" className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold">
                    VIEW LAB PACKAGES
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-60 blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-sky-200 to-sky-300 opacity-60 blur-xl"></div>
              <div className="relative group">
                <Image
                  src="/images/robotics-lab-hero.jpg"
                  alt="Modern Robotics and AI Laboratory"
                  width={700}
                  height={500}
                  className="relative z-10 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              What Value do we bring ?
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Comprehensive solutions to make your institution a center of innovation and excellence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {valuePropositions.map((proposition, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="space-y-6 p-0">
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${proposition.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <proposition.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{proposition.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium tracking-tight">{proposition.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Setup Process */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              How to Set Up Robotics & AI Lab
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Simple 4-step process to transform your institution with cutting-edge technology
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {setupSteps.map((step) => (
              <div
                key={step.step}
                className="relative group text-center"
                onMouseEnter={() => setActiveStep(step.step)}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} transition-all duration-300 ${
                  activeStep === step.step ? 'opacity-100' : 'opacity-10'
                }`}></div>
                <Card className="border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 h-full">
                  <CardContent className="space-y-6 p-0">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white text-2xl font-bold`}>
                      {step.step}
                    </div>
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium tracking-tight">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Lab Equipment & Kits
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Comprehensive range of equipment for complete Robotics & AI learning experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {equipmentCategories.map((category, index) => (
              <Card
                key={index}
                className="group border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="space-y-6 p-0">
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight text-center">{category.name}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium tracking-tight text-center">{category.description}</p>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium tracking-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Requirements */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Infrastructure Requirements for Lab Set-up
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Everything you need to create the perfect learning environment
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {infrastructureRequirements.map((category, index) => (
              <Card
                key={index}
                className="border-0 bg-white/80 backdrop-blur-sm p-8 hover:bg-white transition-all duration-300 hover:shadow-2xl shadow-lg"
              >
                <CardContent className="space-y-6 p-0">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    {category.requirements.map((requirement, reqIndex) => (
                      <div key={reqIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium tracking-tight text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Packages */}
      <section id="lab-packages" className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Choose Your Lab Package
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Flexible packages designed for institutions of all sizes and budgets
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {labPackages.map((pkg, index) => (
              <Card
                key={index}
                className="group border-2 relative overflow-hidden hover:border-sky-300 transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <CardContent className="p-8 relative">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                      {pkg.originalPrice > pkg.price && (
                        <span className="text-lg text-gray-500 line-through">${pkg.originalPrice}</span>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Best for: {pkg.bestFor}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium tracking-tight text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700"
                    onClick={() => addItem({
                      id: `lab-package-${index + 1}`,
                      title: `${pkg.name} Lab Package`,
                      price: pkg.price,
                      originalPrice: pkg.originalPrice,
                      image: null,
                      provider: "Mechatron Robotics",
                      type: "lab-package",
                    })}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Institutions */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Our Present & Past Associations
            </h2>
            <p className="mx-auto max-w-4xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed tracking-tight">
              Trusted by leading educational institutions worldwide
            </p>
          </div>

          <div className="space-y-12">
            {/* Foundations */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-tight">Foundations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {partnerInstitutions.foundations.map((institution, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="text-lg font-semibold text-gray-900 tracking-tight">{institution}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schools */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-tight">Schools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {partnerInstitutions.schools.map((school, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <School className="h-8 w-8 text-sky-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900 tracking-tight">{school}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colleges */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-tight">Colleges</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {partnerInstitutions.colleges.map((college, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <Building className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900 tracking-tight">{college}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-4xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto tracking-tight">
            Join hundreds of educational institutions that have successfully implemented our Robotics & AI labs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                className="rounded-full bg-white text-sky-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-xl tracking-tight"
              >
                Schedule Campus Visit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-sky-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200 tracking-tight"
              >
                <Play className="mr-2 h-4 w-4" />
                View Lab Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}