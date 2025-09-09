"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, BadgeCheck, BookOpen, LineChart, CalendarClock, Briefcase, Layers3, Sparkles } from "lucide-react"

export default function ForEducatorsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero - navy/charcoal */}
      <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(2,6,23,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(15,23,42,0.35),transparent_55%)]" />
        <div className="mx-auto max-w-7xl relative">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Empower your classrooms with
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">AI-ready curriculum</span>
              </h1>
              <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed max-w-2xl tracking-tight">
                Standards-aligned courses, auto-graded projects, and dashboards built for real learning outcomes.
              </p>
              <div className="flex gap-4">
                <Link href="/login"><Button className="rounded-full bg-gradient-to-r from-indigo-600 to-slate-800 px-8 py-6 text-base font-bold text-white hover:from-indigo-700 hover:to-slate-900">Get Started</Button></Link>
                <Link href="#demo"><Button variant="outline" className="rounded-full px-8 py-6 text-base font-bold border-slate-300 text-slate-800 hover:bg-slate-50">Request Demo</Button></Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-indigo-300/40 blur-xl" />
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-slate-300/40 blur-xl" />
              <div className="absolute right-12 top-1/2 h-20 w-20 rounded-full bg-blue-300/40 blur-xl" />
              <Image src="/images/aiskoollogo.png" alt="Educators" width={720} height={520} className="relative z-10 rounded-3xl shadow-2xl ring-1 ring-slate-200/50" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works - alternating narrative */}
      <section className="bg-white px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl space-y-16">
          {[
            {title:"Plan",desc:"Map units to terms and auto-generate lesson plans with resources.",img:'/images/skool1.png'},
            {title:"Teach",desc:"Use teacher tools, rubrics, and auto-graded projects in class.",img:'/images/aiskoollogo.png'},
            {title:"Measure",desc:"Track mastery, attendance, and interventions in one place.",img:'/images/skool.jpg'},
          ].map((row,i)=> (
            <div key={i} className={`grid items-center gap-10 md:grid-cols-2 ${i%2===1 ? 'md:[&>div:first-child]:order-2' : ''}`}>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{row.title}</h3>
                <p className="mt-3 text-gray-600 max-w-prose">{row.desc}</p>
              </div>
              <div className="rounded-3xl border shadow-sm overflow-hidden">
                <Image src={row.img} alt={row.title} width={720} height={480} className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why schools choose us */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why schools choose AiSkool</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">Solve the hard parts of AI education at scale.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[{icon:Layers3,title:"Full-stack Curriculum",desc:"K-12 pathways with projects and assessments."},{icon:LineChart,title:"Dashboards",desc:"Progress, mastery, and attendance trackers."},{icon:CalendarClock,title:"Scheduling",desc:"Timetables and live session tools."},{icon:Briefcase,title:"Teacher Tools",desc:"Rubrics, lesson plans, and auto-grading."}].map((f,i)=> (
              <Card key={i} className="border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl transition-all rounded-2xl">
                <CardContent className="p-0 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-slate-800 text-white">
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

      {/* Programs */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Programs for every need</h2>
            <p className="mx-auto max-w-3xl text-gray-600">Choose a deployment that fits your classrooms and infrastructure.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[{title:"In-School",desc:"Timetabled periods, labs, and integrated grading."},{title:"After-School",desc:"Clubs, competitions, and showcases."},{title:"Hybrid",desc:"Blended learning with weekend mentorship."}].map((c,i)=> (
              <Card key={i} className="group border border-slate-200 bg-white p-6 hover:scale-[1.01] transition-all shadow-md rounded-2xl">
                <CardContent className="p-0">
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 text-gray-600">{c.desc}</p>
                  <Button variant="outline" className="mt-4 rounded-full border-slate-300 text-slate-800 hover:bg-slate-50">See Curriculum</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison band */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center">Simple options</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[{name:'Starter',items:['Up to 2 classes','Email support','Basic analytics']},{name:'Standard',items:['School-wide','Priority support','Full analytics']},{name:'Enterprise',items:['Multi-school','SLA & training','Custom integrations']}].map((p,i)=> (
              <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                <h4 className="text-xl font-bold">{p.name}</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {p.items.map((it,idx)=> <li key={idx}>• {it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-900 px-4 py-20 md:px-6 md:py-24 text-white">
        <div className="mx-auto max-w-7xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Bring AiSkool to your school</h2>
          <p className="mx-auto max-w-3xl text-slate-200">We’ll help you launch within weeks with training and support.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login"><Button variant="secondary" className="rounded-full px-8 py-6 text-base font-bold">Start Free</Button></Link>
            <Link href="/contact"><Button className="rounded-full bg-white text-slate-900 hover:bg-white/90 px-8 py-6 text-base font-bold">Talk to Sales</Button></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
