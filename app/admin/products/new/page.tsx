"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [tagline, setTagline] = useState("")
  const [description, setDescription] = useState("")
  const [heroImage, setHeroImage] = useState("")

  // Theme simple fields
  const [themeFrom, setThemeFrom] = useState("from-pink-500")
  const [themeTo, setThemeTo] = useState("to-purple-600")
  const [themeAccent, setThemeAccent] = useState("text-purple-600")
  const [themeSoft, setThemeSoft] = useState("from-pink-50 to-white")
  const [themeGradient, setThemeGradient] = useState("bg-gradient-to-r from-pink-500 to-purple-600")
  const [themeLight, setThemeLight] = useState("bg-pink-100")

  // Section headings/subtitles
  const [technologiesTitle, setTechnologiesTitle] = useState("Technologies at Focus")
  const [technologiesSubtitle, setTechnologiesSubtitle] = useState("Gain hands-on experience with advanced, 21st-century technologies that offer engaging and practical ways for kids to apply their learning.")
  const [highlightsTitle, setHighlightsTitle] = useState("Why choose this product?")
  const [highlightsSubtitle, setHighlightsSubtitle] = useState("Learn 21st-century technologies with a fun and structured experience.")
  const [techOverview, setTechOverview] = useState("This product is a powerful, portable device that allows users to create complex projects with modern connectivity and sensors.")

  // Repeatable groups
  const [highlights, setHighlights] = useState<Array<{ title: string; subtitle?: string }>>([
    { title: "Fun Learning For Ages 7+", subtitle: "Engaging, age-appropriate projects" },
  ])
  const [technologies, setTechnologies] = useState<Array<{ title: string; image?: string; icon?: string }>>([
    { title: "Artificial Intelligence", image: "/uploads/img-intro-removebg-preview.png", icon: "brain" },
  ])
  const [kits, setKits] = useState<Array<{ title: string; description?: string; age?: string; courses: string[]; features: string[] }>>([
    { title: "Ultimate Kit", description: "Hands-on AI, Robotics & Coding", age: "7-15 Years", courses: ["2 Graphical Courses"], features: ["Robot with multiple configurations"] },
  ])
  const [addons, setAddons] = useState<Array<{ title: string; description?: string; icon?: string }>>([
    { title: "Mecanum Wheel Robot", description: "Multi-directional movement", icon: "car" },
  ])
  const [techSpecs, setTechSpecs] = useState<Array<{ text: string }>>([
    { text: "Powerful processor" },
  ])

  const onSubmit = async () => {
    try {
      if (!name || !slug) {
        toast({ title: "Name and Slug are required", variant: "destructive" })
        return
      }

      const body = {
        name,
        slug,
        tagline: tagline || null,
        description: description || null,
        hero_image: heroImage || null,
        technologies_title: technologiesTitle || null,
        technologies_subtitle: technologiesSubtitle || null,
        highlights_title: highlightsTitle || null,
        highlights_subtitle: highlightsSubtitle || null,
        tech_overview: techOverview || null,
        theme: {
          from: themeFrom,
          to: themeTo,
          accent: themeAccent,
          soft: themeSoft,
          gradient: themeGradient,
          light: themeLight,
        },
        highlights,
        technologies,
        kits,
        addons,
        tech_specs: techSpecs,
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Failed (${res.status})`)
      }

      toast({ title: "Product saved" })
      router.push(`/admin/products`)
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || String(e), variant: "destructive" })
    }
  }

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Add new product</h1>
            <p className="text-gray-600">Create a product and it will appear in the navbar and public products pages.</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Quarky" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="quarky" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Educational Robot" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short description</Label>
                <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero">Hero image URL</Label>
                <Input id="hero" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="/images/quarky-hero.png" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Technologies section title</Label>
                  <Input value={technologiesTitle} onChange={(e)=>setTechnologiesTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Highlights section title</Label>
                  <Input value={highlightsTitle} onChange={(e)=>setHighlightsTitle(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Technologies section subtitle</Label>
                  <Textarea rows={2} value={technologiesSubtitle} onChange={(e)=>setTechnologiesSubtitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Highlights section subtitle</Label>
                  <Textarea rows={2} value={highlightsSubtitle} onChange={(e)=>setHighlightsSubtitle(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tech overview paragraph (left of specs)</Label>
                <Textarea rows={3} value={techOverview} onChange={(e)=>setTechOverview(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-8">
              {/* Theme fields */}
              <div>
                <h3 className="font-semibold mb-3">Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="space-y-1 md:col-span-1">
                    <Label>Preset</Label>
                    <Select onValueChange={(v)=>{
                      const map:any = {
                        pink: { from:"from-pink-500", to:"to-purple-600", accent:"text-purple-600", soft:"from-pink-50 to-white", gradient:"bg-gradient-to-r from-pink-500 to-purple-600", light:"bg-pink-100" },
                        purple: { from:"from-violet-500", to:"to-fuchsia-600", accent:"text-violet-600", soft:"from-violet-50 to-white", gradient:"bg-gradient-to-r from-violet-500 to-fuchsia-600", light:"bg-violet-100" },
                        blue: { from:"from-sky-500", to:"to-indigo-600", accent:"text-indigo-600", soft:"from-sky-50 to-white", gradient:"bg-gradient-to-r from-sky-500 to-indigo-600", light:"bg-sky-100" },
                        emerald: { from:"from-emerald-500", to:"to-teal-600", accent:"text-emerald-600", soft:"from-emerald-50 to-white", gradient:"bg-gradient-to-r from-emerald-500 to-teal-600", light:"bg-emerald-100" },
                        orange: { from:"from-orange-500", to:"to-amber-600", accent:"text-orange-600", soft:"from-orange-50 to-white", gradient:"bg-gradient-to-r from-orange-500 to-amber-600", light:"bg-orange-100" },
                      }
                      const p = map[v]
                      if (p){
                        setThemeFrom(p.from); setThemeTo(p.to); setThemeAccent(p.accent); setThemeSoft(p.soft); setThemeGradient(p.gradient); setThemeLight(p.light)
                      }
                    }}>
                      <SelectTrigger><SelectValue placeholder="Choose a preset" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="emerald">Emerald</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label>From</Label>
                    <Input value={themeFrom} onChange={(e) => setThemeFrom(e.target.value)} placeholder="from-pink-500" />
                  </div>
                  <div className="space-y-1">
                    <Label>To</Label>
                    <Input value={themeTo} onChange={(e) => setThemeTo(e.target.value)} placeholder="to-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <Label>Accent</Label>
                    <Input value={themeAccent} onChange={(e) => setThemeAccent(e.target.value)} placeholder="text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <Label>Soft</Label>
                    <Input value={themeSoft} onChange={(e) => setThemeSoft(e.target.value)} placeholder="from-pink-50 to-white" />
                  </div>
                  <div className="space-y-1">
                    <Label>Gradient</Label>
                    <Input value={themeGradient} onChange={(e) => setThemeGradient(e.target.value)} placeholder="bg-gradient-to-r from-pink-500 to-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <Label>Light</Label>
                    <Input value={themeLight} onChange={(e) => setThemeLight(e.target.value)} placeholder="bg-pink-100" />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Highlights</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setHighlights((p) => [...p, { title: "" }])}>Add</Button>
                </div>
                <div className="space-y-3">
                  {highlights.map((h, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input placeholder="Title" value={h.title} onChange={(e) => setHighlights((p) => p.map((x, i) => i===idx ? { ...x, title: e.target.value } : x))} />
                      <div className="flex gap-2">
                        <Input placeholder="Subtitle (optional)" value={h.subtitle || ""} onChange={(e) => setHighlights((p) => p.map((x, i) => i===idx ? { ...x, subtitle: e.target.value } : x))} />
                        <Button variant="ghost" onClick={() => setHighlights((p) => p.filter((_, i) => i!==idx))}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Technologies</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setTechnologies((p) => [...p, { title: "" }])}>Add</Button>
                </div>
                <div className="space-y-3">
                  {technologies.map((t, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input placeholder="Title" value={t.title} onChange={(e) => setTechnologies((p) => p.map((x, i) => i===idx ? { ...x, title: e.target.value } : x))} />
                      <Input placeholder="Image URL (optional)" value={t.image || ""} onChange={(e) => setTechnologies((p) => p.map((x, i) => i===idx ? { ...x, image: e.target.value } : x))} />
                      <div className="flex gap-2 items-center">
                        <Select value={t.icon || undefined} onValueChange={(v) => setTechnologies((p) => p.map((x, i) => i===idx ? { ...x, icon: v } : x))}>
                          <SelectTrigger><SelectValue placeholder="Icon (optional)" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="code">Coding</SelectItem>
                            <SelectItem value="brain">AI</SelectItem>
                            <SelectItem value="robotics">Robotics</SelectItem>
                            <SelectItem value="car">Self Driving</SelectItem>
                            <SelectItem value="users">Interactive AI</SelectItem>
                            <SelectItem value="wifi">Localization/Automation</SelectItem>
                            <SelectItem value="rocket">Rocket</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" onClick={() => setTechnologies((p) => p.filter((_, i) => i!==idx))}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Kits</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setKits((p) => [...p, { title: "", courses: [], features: [] }])}>Add</Button>
                </div>
                <div className="space-y-4">
                  {kits.map((k, idx) => (
                    <div key={idx} className="border rounded-md p-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input placeholder="Title" value={k.title} onChange={(e) => setKits((p) => p.map((x, i) => i===idx ? { ...x, title: e.target.value } : x))} />
                        <Input placeholder="Age (optional)" value={k.age || ""} onChange={(e) => setKits((p) => p.map((x, i) => i===idx ? { ...x, age: e.target.value } : x))} />
                      </div>
                      <Textarea placeholder="Description (optional)" value={k.description || ""} onChange={(e) => setKits((p) => p.map((x, i) => i===idx ? { ...x, description: e.target.value } : x))} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input placeholder="Courses (comma separated)" value={k.courses.join(", ")} onChange={(e) => setKits((p) => p.map((x, i) => i===idx ? { ...x, courses: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) } : x))} />
                        <Input placeholder="Features (comma separated)" value={k.features.join(", ")} onChange={(e) => setKits((p) => p.map((x, i) => i===idx ? { ...x, features: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) } : x))} />
                      </div>
                      <div className="flex justify-end">
                        <Button variant="ghost" onClick={() => setKits((p) => p.filter((_, i) => i!==idx))}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Add-ons</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setAddons((p) => [...p, { title: "" }])}>Add</Button>
                </div>
                <div className="space-y-3">
                  {addons.map((a, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input placeholder="Title" value={a.title} onChange={(e) => setAddons((p) => p.map((x, i) => i===idx ? { ...x, title: e.target.value } : x))} />
                      <Input placeholder="Description (optional)" value={a.description || ""} onChange={(e) => setAddons((p) => p.map((x, i) => i===idx ? { ...x, description: e.target.value } : x))} />
                      <div className="flex gap-2 items-center">
                        <Select value={a.icon || undefined} onValueChange={(v) => setAddons((p) => p.map((x, i) => i===idx ? { ...x, icon: v } : x))}>
                          <SelectTrigger><SelectValue placeholder="Icon (optional)" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="rocket">Rocket</SelectItem>
                            <SelectItem value="globe">Globe</SelectItem>
                            <SelectItem value="bot">Bot</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" onClick={() => setAddons((p) => p.filter((_, i) => i!==idx))}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech specs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Tech specs</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setTechSpecs((p) => [...p, { text: "" }])}>Add</Button>
                </div>
                <div className="space-y-3">
                  {techSpecs.map((s, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input placeholder="Spec text" value={s.text} onChange={(e) => setTechSpecs((p) => p.map((x, i) => i===idx ? { ...x, text: e.target.value } : x))} />
                      <Button variant="ghost" onClick={() => setTechSpecs((p) => p.filter((_, i) => i!==idx))}>Remove</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button onClick={onSubmit}>Save product</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </Protect>
  )
}
