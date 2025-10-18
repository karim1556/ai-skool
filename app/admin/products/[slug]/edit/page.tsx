"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const currentSlug = String(params.slug)
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

  // dropdown options
  const [categories, setCategories] = useState<string[]>(["Physical Product", "Course", "Accessory"])
  const [levels, setLevels] = useState<string[]>(["Beginner", "Intermediate", "Advanced"])
  const [deliveries, setDeliveries] = useState<string[]>(["2-3 days", "Pickup", "Ships in 1 week"])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(`/api/products/${currentSlug}`, { cache: "no-store" })
        if (!res.ok) throw new Error(await res.text())
        const p = await res.json()
        if (ignore) return
        setName(p.name || "")
        setSlug(p.slug || currentSlug)
        setDescription(p.description || "")
        setHeroImage(p.hero_image || "")
        setPrice(p.price ?? "")
        setOriginalPrice(p.original_price ?? "")
        setRating(p.rating ?? "")
        setReviews(p.reviews ?? "")
        setImage(p.image || "")
        setCategoryField(p.category || "")
        setIsBestSeller(Boolean(p.is_best_seller))
        setIsNewField(Boolean(p.is_new))
        setInStockField(p.in_stock ?? true)
        setFeaturesField(Array.isArray(p.features) ? p.features : [])
        setDeliveryField(p.delivery || "")
        setLevelField(p.level || "")
        setInstructorField(p.instructor || "")
        setDurationField(p.duration || "")
        setStudentsField(p.students ?? "")
        setTagsField(Array.isArray(p.tags) ? p.tags : [])
        setDiscountField(p.discount ?? "")
        setVideoPreviewField(p.video_preview || "")
      } catch (e: any) {
        toast({ title: "Failed to load product", description: e?.message || String(e), variant: "destructive" })
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [currentSlug, toast])

  useEffect(() => {
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

  const onSubmit = async () => {
    try {
      if (!name || !slug) {
        toast({ title: "Name and Slug are required", variant: "destructive" })
        return
      }

      // Merge with any existing product data so we don't wipe fields edited via the Fill form
      // Fetch the current product to merge (server has the latest row)
      let existing: any = {}
      try {
        const r = await fetch(`/api/products/${encodeURIComponent(currentSlug)}`, { cache: 'no-store' })
        if (r.ok) existing = await r.json()
      } catch (_) {}

      const body = {
        ...existing,
        name,
        slug,
        description: description || existing.description || null,
        hero_image: heroImage || existing.hero_image || existing.image || null,
        price: price !== "" ? price : (existing.price ?? null),
        original_price: originalPrice !== "" ? originalPrice : (existing.original_price ?? null),
        rating: rating !== "" ? rating : (existing.rating ?? null),
        reviews: reviews !== "" ? reviews : (existing.reviews ?? null),
        image: image || existing.image || null,
        category: categoryField || existing.category || null,
        is_best_seller: isBestSeller ?? existing.is_best_seller,
        is_new: isNewField ?? existing.is_new,
        in_stock: inStockField ?? (existing.in_stock === undefined ? true : existing.in_stock),
        features: (featuresField && featuresField.length) ? featuresField : (existing.features ?? null),
        delivery: deliveryField || existing.delivery || null,
        level: levelField || existing.level || null,
        instructor: instructorField || existing.instructor || null,
        duration: durationField || existing.duration || null,
        students: studentsField !== "" ? studentsField : (existing.students ?? null),
        tags: (tagsField && tagsField.length) ? tagsField : (existing.tags ?? null),
        discount: discountField !== "" ? discountField : (existing.discount ?? null),
        video_preview: videoPreviewField || existing.video_preview || null,
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

      toast({ title: "Product saved", description: `slug: ${data?.slug || slug}` })
  // Navigate to public product detail to confirm listing
  router.push(`/product/${encodeURIComponent(data?.slug || slug)}`)
    } catch (err: any) {
      toast({ title: err?.message || String(err), variant: "destructive" })
    }
  }

  if (loading) return (
    <Protect>
      <AdminLayout>
        <p className="text-gray-500">Loading...</p>
      </AdminLayout>
    </Protect>
  )

  return (
    <Protect>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Edit product</h1>

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
                <div className="flex gap-2">
                  <Input id="hero" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="/images/quarky-hero.png" />
                  <Input id="heroFile" type="file" accept="image/*" onChange={async (e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    await handleHeroFile(f)
                  }} />
                </div>
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
