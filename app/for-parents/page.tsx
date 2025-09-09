"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Clock, Sparkles, Users, Calendar, Star, ShoppingCart } from "lucide-react"

export default function ForParentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-rose-50/30 to-amber-50/30">
      {/* Hero - warm and playful */}
      <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(244,63,94,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(245,158,11,0.12),transparent_55%)]" />
        <div className="mx-auto max-w-7xl relative">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Give your child
                <br />
                <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">a head start</span>
              </h1>
              <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
                Hands-on AI, robotics, and coding that builds confidence, creativity, and real-world problem solving.
              </p>
              <div className="flex gap-4">
                <Link href="/login"><Button className="rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-8 py-6 text-base font-bold text-white hover:from-rose-600 hover:to-amber-600">Get Started</Button></Link>
                <Link href="#pricing"><Button variant="outline" className="rounded-full px-8 py-6 text-base font-bold border-rose-200 text-rose-700 hover:bg-rose-50">View Plans</Button></Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-rose-200/60 blur-xl" />
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-200/60 blur-xl" />
              <div className="absolute right-12 top-1/2 h-20 w-20 rounded-full bg-pink-200/60 blur-xl" />
              <div className="relative z-10 rotate-2 rounded-3xl shadow-2xl ring-1 ring-rose-200/50 overflow-hidden">
                <Image src="/images/skool.jpg" alt="Parent and child learning" width={720} height={520} className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights - horizontal scroll */}
      <section className="bg-white px-4 py-12 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold tracking-tight">Highlights</h3>
            <span className="text-sm text-gray-500">Swipe to explore</span>
          </div>
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex gap-6 pr-6">
              {[
                {tag:"Creativity",title:"Build story-games with AI",desc:"Kids design characters, scenes, and choices."},
                {tag:"Robotics",title:"Sense the world",desc:"Program sensors to react in real time."},
                {tag:"Automation",title:"Daily task bots",desc:"Automate homework checklists and reminders."},
                {tag:"Showcase",title:"Monthly demo day",desc:"Present projects and get feedback."},
              ].map((h,i)=> (
                <div key={i} className="w-[320px] shrink-0 rounded-2xl border bg-white p-5 shadow-sm hover:shadow-lg transition-all">
                  <span className="inline-block rounded-full bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-1">{h.tag}</span>
                  <h4 className="mt-3 text-lg font-bold">{h.title}</h4>
                  <p className="mt-1 text-gray-600 text-sm">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Families */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Built for busy families</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">Flexible, safe, and truly engaging.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[{icon:Clock,title:"Flexible Schedules",desc:"Self-paced lessons plus live sessions."},{icon:Shield,title:"Safe & Private",desc:"Age-appropriate content and moderated spaces."},{icon:Sparkles,title:"Project-Based",desc:"Learners build real things they can show."},{icon:Users,title:"Community",desc:"Clubs, showcases, and supportive mentors."}].map((f,i)=> (
              <Card key={i} className="border border-rose-100 bg-white/80 backdrop-blur p-6 text-center shadow-lg hover:shadow-2xl transition-all rounded-2xl">
                <CardContent className="p-0 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg">
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What they’ll explore</h2>
            <p className="mx-auto max-w-3xl text-gray-600">Age-based tracks from foundational logic to advanced AI projects.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[{title:"Level 1",desc:"Creative coding, sensors, and simple AI prompts."},{title:"Level 2",desc:"Build bots and apps that automate tasks."},{title:"Level 3",desc:"AI reasoning, data, and mini products."}].map((c,i)=> (
              <Card key={i} className="group border-0 bg-white/80 backdrop-blur p-6 hover:scale-[1.02] transition-all shadow-xl">
                <CardContent className="p-0">
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 text-gray-600">{c.desc}</p>
                  <Button variant="outline" className="mt-4 rounded-full">See Courses</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - horizontal scroll */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Loved by parents</h2>
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex gap-6 pr-6">
              {["Confidence shot up in a month!","Finally something better than screen time.","Projects my kid shows off to the whole family.","The clubs kept my kid motivated all term.","Clear progress without pressure."].map((q,i)=> (
                <Card key={i} className="w-[360px] shrink-0 border-0 bg-white/80 backdrop-blur p-6 shadow-lg">
                  <CardContent className="p-0">
                    <Star className="h-5 w-5 text-yellow-500 inline mr-1" />
                    <Star className="h-5 w-5 text-yellow-500 inline mr-1" />
                    <Star className="h-5 w-5 text-yellow-500 inline mr-1" />
                    <Star className="h-5 w-5 text-yellow-500 inline mr-1" />
                    <Star className="h-5 w-5 text-yellow-500 inline" />
                    <p className="mt-3 text-gray-700">{q}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-24 text-white">
        <div className="mx-auto max-w-7xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start your child’s AI journey</h2>
          <p className="mx-auto max-w-3xl text-sky-100">Enroll today and get instant access to beginner projects.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login"><Button variant="secondary" className="rounded-full px-8 py-6 text-base font-bold">Create Account</Button></Link>
            <Link href="/#courses"><Button className="rounded-full bg-white text-sky-700 hover:bg-white/90 px-8 py-6 text-base font-bold"><ShoppingCart className="h-4 w-4 mr-2"/>Browse Courses</Button></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
