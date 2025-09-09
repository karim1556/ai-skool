"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Brain, Zap, Atom, Trophy, BarChart3, Shield, Users, Rocket } from "lucide-react"

export default function WhyAiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Unique intro: sticky narrative + timeline */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-[420px,1fr]">
          {/* Sticky narrative */}
          <div className="md:sticky md:top-24 h-fit">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Why AI-first learning
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-prose">
              Not another app. A new way to think. We combine reasoning, creation, and automation so kids build
              real things that solve real problems.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/for-parents"><Button className="rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white">For Parents</Button></Link>
              <Link href="/for-educators"><Button variant="outline" className="rounded-full">For Educators</Button></Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[["4.9","Avg rating"],["10k+","Students"],["500+","Projects"]].map((s,i)=> (
                <div key={i} className="rounded-2xl border bg-white/70 backdrop-blur p-4">
                  <div className="text-2xl font-bold">{s[0]}</div>
                  <div className="text-xs text-gray-500">{s[1]}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Timeline */}
          <ol className="relative border-s border-slate-200">
            {[
              {title:"Reason with AI",desc:"Kids learn to plan prompts, critique outputs, and make better decisions."},
              {title:"Create with AI",desc:"From stories to simulations—turn ideas into artifacts worth showing."},
              {title:"Automate with AI",desc:"Build bots that actually save time—ethically and safely."},
              {title:"Ship and share",desc:"Portfolios, demos, and club showcases build confidence."},
            ].map((step,i)=> (
              <li key={i} className="ms-6 mb-10">
                <span className="absolute -start-2.5 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-white" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-gray-600">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Outcomes: scrolly narrative */}
      <section className="bg-gradient-to-b from-white to-gray-50 px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-[320px,1fr]">
          <div className="md:sticky md:top-24 h-fit">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Real-world outcomes</h2>
            <p className="mt-3 text-lg text-gray-600">We design for measurable skill growth—not busywork.</p>
          </div>
          <div className="space-y-6">
            {[
              { icon: Trophy, title: "Competitions", desc: "Win robotics & coding challenges with confidence." },
              { icon: BarChart3, title: "Portfolio", desc: "Publish projects that stand out for admissions." },
              { icon: Shield, title: "Safety", desc: "Age-appropriate guardrails and private workspaces." },
              { icon: Users, title: "Collaboration", desc: "Team up, present, and lead with empathy." },
            ].map((f, i) => (
              <Card key={i} className="border border-slate-200/80 bg-white/90 backdrop-blur p-6 shadow-sm hover:shadow-xl transition-all rounded-2xl">
                <CardContent className="p-0 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{f.title}</h3>
                    <p className="text-gray-600 mt-1">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What kids learn: banded */}
      <section className="bg-white px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What kids learn</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">Foundational AI thinking through hands-on modules.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Brain, title: "AI Reasoning", desc: "Prompting, planning, and evaluating AI responses." },
              { icon: Zap, title: "Automation", desc: "Build bots to save time on real tasks." },
              { icon: Atom, title: "Robotics + AI", desc: "Perception and decision-making with sensors." },
              { icon: Sparkles, title: "Creativity", desc: "Story, art, and music with generative tools." },
              { icon: Rocket, title: "Entrepreneurship", desc: "Prototype products and pitch ideas." },
              { icon: Shield, title: "AI Ethics", desc: "Bias, consent, and safe, responsible use." },
            ].map((m, i) => (
              <Card key={i} className="group border border-slate-200/80 bg-white p-6 hover:shadow-2xl transition-all shadow-md rounded-2xl">
                <CardContent className="p-0 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                    <m.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{m.title}</h3>
                  <p className="text-gray-600">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-24 text-white">
        <div className="mx-auto max-w-7xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Bring AI learning to your home or school</h2>
          <p className="mx-auto max-w-3xl text-sky-100">Choose a path that fits your needs and get started in minutes.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/for-parents"><Button variant="secondary" className="rounded-full px-8 py-6 text-base font-bold">I’m a Parent</Button></Link>
            <Link href="/for-educators"><Button className="rounded-full bg-white text-sky-700 hover:bg-white/90 px-8 py-6 text-base font-bold">I’m an Educator</Button></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
