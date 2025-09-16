"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sparkles, Brain, Code2, ChevronRight, Star, Zap, Shield, Heart, Play, BookOpen, Users, Rocket, Wifi, Cpu, Battery, Smartphone, Car, Bot, House, Globe } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useInView } from "framer-motion"

// Animation wrapper component
const AnimatedSection = ({ children, className = "", delay = 0.3 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div 
      ref={ref}
      className={className}
      style={{
        transform: isInView ? "none" : "translateY(50px)",
        opacity: isInView ? 1 : 0,
        transition: `all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(`/api/products/${slug}`, { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          if (!ignore) setProduct(data)
        }
      } catch {}
      finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [slug])

  const title = useMemo(() => product?.name ?? String(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), [product, slug])

  const theme = useMemo(() => {
    const t = product?.theme || {}
    const fallback = {
      from: "from-pink-500",
      to: "to-purple-600",
      accent: "text-purple-600",
      soft: "from-pink-50 to-white",
      gradient: "bg-gradient-to-r from-pink-500 to-purple-600",
      darkGradient: "bg-gradient-to-r from-pink-600 to-purple-700",
      light: "bg-pink-100",
    }
    return { ...fallback, ...t }
  }, [product])

  const heroImage = product?.hero_image || "/uploads/img-intro-removebg-preview.png"

  const quarkyKits = Array.isArray(product?.kits) ? product!.kits : [
    {
      title: "Quarky Ultimate Kit",
      description: "The REST Companion for Kids with complete hands-on experience to learn AI, Robotics & Coding with 10+ robotics configurations and 50+ projects.",
      age: "7-15 Years",
      courses: ["4 Graphical Programming Courses", "4 Python Programming Courses"],
      features: ["Quarky Robot with 10+ Configurations"]
    },
    {
      title: "Quarky Innovator Kit",
      description: "Beginner Programmable Robot Kit to learn AI, robotics, and self-driving technology for all ages and coding skills.",
      age: "7-15 Years",
      courses: ["2 Graphical Programming Courses", "2 Python Programming Courses"],
      features: ["Quarky Robot with 2 Configurations"]
    },
    {
      title: "Quarky Explorer Kit",
      description: "A programmable board that can help kids of all ages and coding abilities learn about coding, artificial intelligence, and physical computing.",
      age: "7-15 Years",
      courses: ["1 Graphical Programming Course", "1 Python Programming Course"],
      features: ["Only Quarky Board"]
    }
  ]

  const addOnKits = Array.isArray(product?.addons) ? product!.addons : [
    {
      title: "Mecanum Wheel Robot",
      description: "Discover interesting multi-directional movements of the Mecanum Wheel Robot - build foundations of industrial technology.",
      icon: <Car className="w-8 h-8" />
    },
    {
      title: "Humanoid Kit",
      description: "A humanoid robot that can walk and dance team mechanics and advanced concepts of robotics, coding & AI with Humanoid Kit.",
      icon: <Users className="w-8 h-8" />
    },
    {
      title: "Quadruped Kit",
      description: "Explore four-footed mechanical actions, creep-gait algorithms, and sprawling movements with the Quadruped robot.",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      title: "Mars Rover Kit",
      description: "Build the Mars Rover with the rocket-bogie mechanism based on the one from NASA and dive into coding robots for outer space.",
      icon: <Globe className="w-8 h-8" />
    },
    {
      title: "Robotic Arm Kit",
      description: "Grasp the concepts of new-age industrial robotics using the basics of electromechanics of the 4 DPS with Robotic Arm.",
      icon: <Bot className="w-8 h-8" />
    },
    {
      title: "IoT House Kit",
      description: "Make the IoT House with AI enabled, security and gardening system. Learn to remotely use any device or choice with the smart plug!",
      icon: <House className="w-8 h-8" />
    }
  ]

  // Technologies list (cards)
  const technologies = Array.isArray(product?.technologies) ? product!.technologies : null

  // Normalize tech specs items (may be strings or { text })
  const normalizedTechSpecs = (Array.isArray(product?.tech_specs) ? product!.tech_specs : [
    { icon: <Cpu className="w-5 h-5" />, text: "Powerful processor for complex projects" },
    { icon: <Battery className="w-5 h-5" />, text: "3.7V Li-ion battery support" },
    { icon: <Wifi className="w-5 h-5" />, text: "Wi-Fi and Bluetooth compatibility" },
    { icon: <Smartphone className="w-5 h-5" />, text: "Programmable via smartphone" }
  ]).map((s: any) => {
    if (typeof s === 'string') return { text: s }
    return s
  })

  // "Highlights" (why it's best)
  const highlights = Array.isArray(product?.highlights) ? product!.highlights : [
    {
      title: "One Buddy, Infinite Creations",
      description: "Transform Quarky into anything. You can make hundreds of real world application-based projects such as an expression detector, AI delivery box, home automation system, etc."
    },
    {
      title: "Learn Industry-Standard Concepts",
      description: "Quarky helps you understand widely used artificial intelligence concepts such as machine learning, self-driving cars, face recognition, speech recognition, etc."
    },
    {
      title: "Programmable with Smartphone",
      description: "Code and control all your projects, games, animations, and robots anytime, anywhere using a smartphone or tablet."
    },
    {
      title: "Self Driving Cars",
      description: "Create real world projects with Quarky and incubate important 21st century skills such as creative thinking."
    }
  ]


  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-b ${theme.soft}`}>
        {/* Animated particles background */}
        <div className="absolute inset-0 z-0">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full ${i % 3 === 0 ? 'w-3 h-3' : i % 2 === 0 ? 'w-2 h-2' : 'w-1 h-1'} ${theme.light} opacity-50`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float${i % 3 + 1} ${5 + Math.random() * 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
          <AnimatedSection className="space-y-6">
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r ${theme.from} ${theme.to} bg-clip-text text-transparent`}>{title}</span>
              <Badge className={`rounded-full ${theme.gradient} text-white px-3 py-1 flex items-center gap-1`}>
                <Star className="w-3 h-3 fill-current" /> {product?.tagline ? product.tagline : 'Featured'}
              </Badge>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-snug">
              {product?.description ? product.description : 'Learn AI. Make bots.'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Have Fun!</span>
            </h2>
            {product?.description && (
              <p className="text-gray-600 max-w-xl text-lg">{product.description}</p>
            )}
            
            <div className="flex items-center gap-3 mt-8">
              <Button className={`rounded-full ${theme.gradient} px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 group`}>
                Shop Now
                <Zap className="ml-2 h-4 w-4 group-hover:animate-pulse" />
              </Button>
              <Button variant="outline" className="rounded-full border-gray-300 px-8 py-3 text-gray-800 font-semibold hover:bg-white/60 bg-white transition-all hover:shadow-md group">
                Watch Demo
                <Play className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 font-medium text-gray-700">4.9/5</span>
              </div>
              <div>•</div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-500 mr-1" /> 
                Safe for kids
              </div>
              <div>•</div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-pink-500 mr-1" />
                500+ students
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="relative" delay={0.5}>
            <div className="relative z-10 hover:scale-105 transition-transform duration-700">
              <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image 
                      src={heroImage} 
                      alt={title} 
                      fill 
                      className="object-contain p-8" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Floating elements around the product */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-lg bg-white/80 backdrop-blur-md shadow-lg p-2 z-20 animate-float">
              <div className="rounded-lg bg-blue-100 w-full h-full flex items-center justify-center">
                <Code2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/80 backdrop-blur-md shadow-lg p-2 z-20 animate-float-reverse">
              <div className="rounded-full bg-green-100 w-full h-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        {/* Animated scroll indicator */}
        {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
          </div>
        </div> */}
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{product?.technologies_title || 'Technologies at Focus'}</h2>
            {(product?.technologies_subtitle || ' ')
              && (
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
                  {product?.technologies_subtitle || 'Gain hands-on experience with advanced, 21st-century technologies that offer engaging and practical ways for kids to apply their learning.'}
                </p>
              )}
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(technologies || [
              { title: 'Coding: Block and Python' },
              { title: 'Artificial Intelligence' },
              { title: 'Robotics' },
              { title: 'Self Driving Technology' },
              { title: 'Interactive AI' },
              { title: 'Localization and Automation' },
            ]).map((tech: any, index: number) => (
              <AnimatedSection key={index} delay={0.1 * index}>
                <Card className="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${theme.light} mb-4 overflow-hidden group-hover:scale-110 transition-transform`}>
                    {tech?.image ? (
                      <Image src={tech.image} alt={tech.title || 'Technology'} width={48} height={48} className="object-contain" />
                    ) : (
                      <Code2 className="w-10 h-10" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{tech.title}</h3>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Quarky Kits Section */}
      <section className={`py-16 ${theme.soft}`}>
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Quarky Kits for Students</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Choose the perfect <strong>educational robotics kits</strong> for your kids, each designed to explore new dimensions of learning.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quarkyKits.map((kit: any, index: number) => (
              <AnimatedSection key={index} delay={0.2 * index}>
                <Card className="h-full border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-video relative bg-gray-100">
                    <Image 
                      src={`/images/quarky-kit-${index+1}.jpg`} 
                      alt={kit.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={`${theme.gradient} text-white`}>Popular</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{kit.title}</h3>
                    <p className="text-gray-600 mb-4">{kit.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <span className="font-medium">Age Group:</span>
                        <span className="ml-2">{kit.age}</span>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">Includes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {kit.courses.map((course: any, i: number) => (
                            <li key={i} className="flex items-start">
                              <BookOpen className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                              {course}
                            </li>
                          ))}
                          {kit.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <Rocket className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Button className={`w-full ${theme.gradient} text-white`}>
                      Explore More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Quarky Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{product?.highlights_title || `Why is ${title} the best?`}</h2>
            {(product?.highlights_subtitle || ' ') && (
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
                {product?.highlights_subtitle || 'Learn to use 21st-century technologies with a fun-filled experience.'}
              </p>
            )}
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlights.map((feature: any, index: number) => (
              <AnimatedSection key={index} delay={0.1 * index}>
                <Card className="border-0 shadow-md p-6 hover:shadow-lg transition-shadow group">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${theme.light} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                      {index === 0 && <Sparkles className="w-6 h-6 text-purple-600" />}
                      {index === 1 && <Brain className="w-6 h-6 text-purple-600" />}
                      {index === 2 && <Smartphone className="w-6 h-6 text-purple-600" />}
                      {index === 3 && <Car className="w-6 h-6 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Add-On Kits Section */}
      <section className={`py-16 ${theme.soft}`}>
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">DIY Quarky Add-On Kits for Kids</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Our DIY Addon kits are tailored to students' interests and aspirations, fostering learning in coding, robotics, creativity, and curiosity.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOnKits.map((kit: any, index: number) => (
              <AnimatedSection key={index} delay={0.1 * index}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow group h-full">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-lg ${theme.light} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {kit.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{kit.title}</h3>
                    <p className="text-gray-600 mb-4">{kit.description}</p>
                    <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                      Explore More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}'s Tech</h2>
                <p className="text-gray-600 mb-6">{product?.tech_overview || 'This product is a powerful, portable device that allows users to create complex projects with modern connectivity and sensors.'}</p>
                
                <div className="space-y-4">
                  {normalizedTechSpecs.map((spec: any, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${theme.light} flex items-center justify-center mr-4`}>
                        {spec.icon || <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />}
                      </div>
                      <p className="text-gray-700">{spec.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl transform -skew-y-3"></div>
                <Card className="relative border-0 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video relative">
                      <Image 
                        src="/images/quarky-tech.jpg" 
                        alt="Quarky Technical Specifications"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">ignite creativity</span>?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of young innovators who are already building the future with Quarky
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className={`rounded-full ${theme.gradient} px-8 py-3 text-white font-semibold text-lg hover:shadow-xl transition-all hover:scale-105`}>
                Get Quarky Now
              </Button>
              <Button variant="outline" className="rounded-full border-gray-600 px-8 py-3 text-white font-semibold text-lg hover:bg-gray-800 transition-all">
                Book a Demo
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Add keyframes for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}