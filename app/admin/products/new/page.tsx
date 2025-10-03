"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Basic product fields used in public listing
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [heroImage, setHeroImage] = useState("")

  const [price, setPrice] = useState<number | "">("")
  const [originalPrice, setOriginalPrice] = useState<number | "">("")
  const [rating, setRating] = useState<number | "">("")
  const [reviews, setReviews] = useState<number | "">("")
  const [image, setImage] = useState("")
  const [categoryField, setCategoryField] = useState("")

  const [isBestSeller, setIsBestSeller] = useState(false)
  const [isNewField, setIsNewField] = useState(false)
  const [inStockField, setInStockField] = useState(true)

  const [featuresField, setFeaturesField] = useState<string[]>([])
  const [deliveryField, setDeliveryField] = useState("")
  const [levelField, setLevelField] = useState("")
  const [instructorField, setInstructorField] = useState("")
  const [durationField, setDurationField] = useState("")
  const [studentsField, setStudentsField] = useState<number | "">("")
  const [tagsField, setTagsField] = useState<string[]>([])
  const [discountField, setDiscountField] = useState<number | "">("")
  const [videoPreviewField, setVideoPreviewField] = useState("")

  const onSubmit = async () => {
    try {
      if (!name || !slug) {
        toast({ title: "Name and Slug are required", variant: "destructive" })
        return
      }

      const body = {
        name,
        slug,
        description: description || null,
        hero_image: heroImage || null,
        price: price || null,
        original_price: originalPrice || null,
        rating: rating || null,
        reviews: reviews || null,
        image: image || null,
        category: categoryField || null,
        is_best_seller: isBestSeller,
        is_new: isNewField,
        in_stock: inStockField,
        features: featuresField || null,
        delivery: deliveryField || null,
        level: levelField || null,
        instructor: instructorField || null,
        duration: durationField || null,
        students: studentsField || null,
        tags: tagsField || null,
        discount: discountField || null,
        video_preview: videoPreviewField || null,
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
      router.push("/admin")
    } catch (err: any) {
      toast({ title: err?.message || String(err), variant: "destructive" })
    }
  }

  // sample dropdown options - try to derive categories from existing products or use static list
  const [categories, setCategories] = useState<string[]>(["Physical Product", "Course", "Accessory"])
  const [levels, setLevels] = useState<string[]>(["Beginner", "Intermediate", "Advanced"])
  const [deliveries, setDeliveries] = useState<string[]>(["2-3 days", "Pickup", "Ships in 1 week"])

  useEffect(() => {
    // attempt to fetch existing products to derive categories (non-blocking)
    const load = async () => {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data)) {
          const cats = Array.from(new Set(data.map((p: any) => p.category).filter(Boolean)))
          if (cats.length) setCategories((c) => Array.from(new Set([...c, ...cats])))
        }
      } catch (_) {}
    }
    load()
  }, [])

  // upload helpers using existing supabase client and bucket used elsewhere in the app
  const uploadToSupabase = async (file: File, pathPrefix = 'products') => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const path = `${pathPrefix}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('course-thumbnails').upload(path, file)
      if (error) throw error
      const { data } = supabase.storage.from('course-thumbnails').getPublicUrl(path)
      return data?.publicUrl || null
    } catch (err) {
      console.error('upload error', err)
      return null
    }
  }

  // file input handlers
  const handleImageFile = async (f?: File) => {
    if (!f) return
    const url = await uploadToSupabase(f, 'product-images')
    if (url) setImage(url)
  }

  const handleHeroFile = async (f?: File) => {
    if (!f) return
    const url = await uploadToSupabase(f, 'product-hero')
    if (url) setHeroImage(url)
  }

  const handleVideoFile = async (f?: File) => {
    if (!f) return
    const url = await uploadToSupabase(f, 'product-videos')
    if (url) setVideoPreviewField(url)
  }

  return (
    <Protect>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">New product</h1>

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
                <Label htmlFor="description">Short description</Label>
                <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero">Hero image URL</Label>
                <Input id="hero" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="/images/quarky-hero.png" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input value={price as any} onChange={(e) => setPrice(Number(e.target.value) || "")} placeholder="199" />
                </div>
                <div className="space-y-2">
                  <Label>Original Price</Label>
                  <Input value={originalPrice as any} onChange={(e) => setOriginalPrice(Number(e.target.value) || "")} placeholder="249" />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input value={rating as any} onChange={(e) => setRating(Number(e.target.value) || "")} placeholder="4.7" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Reviews</Label>
                  <Input value={reviews as any} onChange={(e) => setReviews(Number(e.target.value) || "")} placeholder="128" />
                </div>
                <div className="space-y-2">
                  <Label>Image (main)</Label>
                  {image && (
                    <div className="mb-2">
                      <img src={image} alt="image" className="h-28 w-36 object-cover rounded border" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/kids-tablet.jpg" />
                    <Input id="imageFile" type="file" accept="image/*" onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      await handleImageFile(f)
                    }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={categoryField} onChange={(e) => setCategoryField(e.target.value)} className="w-full border rounded px-2 py-1">
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <input placeholder="Add tag" id="tag-input" className="flex-1 border rounded px-2 py-1" onKeyDown={async (e:any) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const v = e.target.value.trim()
                      if (!v) return
                      setTagsField((t) => Array.from(new Set([...t, v])))
                      e.target.value = ''
                    }
                  }} />
                  <button onClick={() => {
                    const el = document.getElementById('tag-input') as HTMLInputElement | null
                    const v = el?.value.trim()
                    if (!v) return
                    setTagsField((t) => Array.from(new Set([...t, v])))
                    if (el) el.value = ''
                  }} className="px-3 py-1 border rounded">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagsField.map((t) => (
                    <span key={t} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                      <span>{t}</span>
                      <button className="text-red-500" onClick={() => setTagsField((s) => s.filter(x => x !== t))}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <input placeholder="Add feature" id="feature-input" className="flex-1 border rounded px-2 py-1" onKeyDown={async (e:any) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const v = e.target.value.trim()
                      if (!v) return
                      setFeaturesField((t) => Array.from(new Set([...t, v])))
                      e.target.value = ''
                    }
                  }} />
                  <button onClick={() => {
                    const el = document.getElementById('feature-input') as HTMLInputElement | null
                    const v = el?.value.trim()
                    if (!v) return
                    setFeaturesField((t) => Array.from(new Set([...t, v])))
                    if (el) el.value = ''
                  }} className="px-3 py-1 border rounded">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {featuresField.map((t) => (
                    <span key={t} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                      <span>{t}</span>
                      <button className="text-red-500" onClick={() => setFeaturesField((s) => s.filter(x => x !== t))}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery</Label>
                  <select value={deliveryField} onChange={(e) => setDeliveryField(e.target.value)} className="w-full border rounded px-2 py-1">
                    <option value="">Select delivery</option>
                    {deliveries.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <select value={levelField} onChange={(e) => setLevelField(e.target.value)} className="w-full border rounded px-2 py-1">
                    <option value="">Select level</option>
                    {levels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Input value={instructorField} onChange={(e) => setInstructorField(e.target.value)} placeholder="Dr. Someone" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={durationField} onChange={(e) => setDurationField(e.target.value)} placeholder="12 weeks" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Students</Label>
                  <Input value={studentsField as any} onChange={(e) => setStudentsField(Number(e.target.value) || "")} placeholder="2500" />
                </div>
                <div className="space-y-2">
                  <Label>Discount %</Label>
                  <Input value={discountField as any} onChange={(e) => setDiscountField(Number(e.target.value) || "")} placeholder="20" />
                </div>
                <div className="space-y-2">
                  <Label>Video Preview URL</Label>
                  {videoPreviewField && (
                    <div className="mb-2">
                      <video src={videoPreviewField} controls className="max-h-40" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input value={videoPreviewField} onChange={(e) => setVideoPreviewField(e.target.value)} placeholder="/videos/course-preview.mp4" />
                    <Input id="videoFile" type="file" accept="video/*" onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      await handleVideoFile(f)
                    }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isBestSeller} onChange={(e)=>setIsBestSeller(e.target.checked)} />
                  <span>Best seller</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isNewField} onChange={(e)=>setIsNewField(e.target.checked)} />
                  <span>New</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={inStockField} onChange={(e)=>setInStockField(e.target.checked)} />
                  <span>In stock</span>
                </label>
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
