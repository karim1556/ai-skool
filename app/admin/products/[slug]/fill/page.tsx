"use client";

import { AdminLayout } from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"
import { Plus, Minus, X, Trash2 } from "lucide-react"
import { PRODUCT_CATEGORIES } from "../../../../../lib/product-categories"

export default function FillProductDetailsPage() {
  const [category, setCategory] = useState("");
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const currentSlug = String(params.slug)
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [basicProduct, setBasicProduct] = useState<any>({})

  // Product Details Fields
  const [tagline, setTagline] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  
  // Highlights & Features
  const [highlights, setHighlights] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newHighlight, setNewHighlight] = useState("")
  const [newFeature, setNewFeature] = useState("")
  // Learning Outcomes (separate from technical features)
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([])
  const [newOutcome, setNewOutcome] = useState("")

  // Why Choose This Product (customer-facing bullets)
  const [whyChoose, setWhyChoose] = useState<string[]>([])
  const [newWhy, setNewWhy] = useState("")

  // Specifications
  const [specifications, setSpecifications] = useState<Array<{key: string, value: string}>>([])
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  // What's in the Box
  const [whatInBox, setWhatInBox] = useState<string[]>([])
  const [newBoxItem, setNewBoxItem] = useState("")

  // Delivery & Stock
  const [deliveryInfo, setDeliveryInfo] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [stockQuantity, setStockQuantity] = useState<number | "">("")
  const [warranty, setWarranty] = useState("")
  // Out of stock toggle (admin) - when true the product will be marked out of stock
  const [isOutOfStock, setIsOutOfStock] = useState(false)

  // Seller Information
  const [sellerName, setSellerName] = useState("")
  const [sellerRating, setSellerRating] = useState<number | "">("")
  const [sellerReviews, setSellerReviews] = useState<number | "">("")

  // Images & Media
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [videoPreview, setVideoPreview] = useState("")

  // Customer Reviews (admin can add full review entries)
  const [customerReviews, setCustomerReviews] = useState<Array<{name:string,rating:number|string,title:string,body:string}>>([])
  const [reviewName, setReviewName] = useState("")
  const [reviewRating, setReviewRating] = useState<number | "">("")
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewBody, setReviewBody] = useState("")

  // Frequently bought together selection
  const [allProducts, setAllProducts] = useState<Array<{id:number,name:string,slug:string}>>([])
  const [frequentlyBought, setFrequentlyBought] = useState<string[]>([])

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(`/api/products/${currentSlug}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(await res.text())
        const p = await res.json()
        if (ignore) return
        
  setBasicProduct(p)
  setTagline(p.tagline ?? '')
  setFullDescription(p.full_description ?? p.long_description ?? '')
  setCategory(p.category ?? "")
  setIsOutOfStock(p.in_stock === false)

        // helper parsers for DB fields that may be strings (JSON) or native objects
        const parseArray = (v: any) => {
          if (Array.isArray(v)) return v
          if (typeof v === 'string') {
            try { const parsed = JSON.parse(v); return Array.isArray(parsed) ? parsed : [] } catch { return [] }
          }
          return []
        }
        const parseObject = (v: any) => {
          if (v && typeof v === 'object') return v
          if (typeof v === 'string') {
            try { return JSON.parse(v) } catch { return {} }
          }
          return {}
        }

        // Highlights & Features
        setHighlights(parseArray(p.highlights))
        setFeatures(parseArray(p.features))

        // Specifications (key-value)
        const specsSource = p.specifications ?? p.tech_specs
        if (specsSource) {
          const specsObj = typeof specsSource === 'string' ? (() => { try { return JSON.parse(specsSource) } catch { return {} } })() : specsSource
          if (specsObj && typeof specsObj === 'object') {
            const specsArray = Object.entries(specsObj).map(([key, value]) => ({ key, value: String(value) }))
            setSpecifications(specsArray)
          } else {
            setSpecifications([])
          }
        } else {
          setSpecifications([])
        }

        // What's in the Box (kits/addons)
        setWhatInBox(parseArray(p.kits ?? p.addons ?? p.what_in_box))

        // Delivery & Stock (preserve 0 values)
        setDeliveryInfo(p.delivery ?? 'FREE delivery')
        setDeliveryDate(p.delivery_date ?? '')
        setStockQuantity(p.stock_quantity ?? p.stockQuantity ?? "")
        setWarranty(p.warranty ?? '1 year manufacturer warranty')

        // Seller Information (may live inside theme or seller)
        const themeSource = p.theme && (typeof p.theme === 'string' ? (() => { try { return JSON.parse(p.theme) } catch { return null } })() : p.theme)
        const sellerSource = (themeSource) || p.seller
        if (sellerSource && typeof sellerSource === 'object') {
          setSellerName(sellerSource.name ?? '')
          setSellerRating(sellerSource.rating ?? "")
          setSellerReviews(sellerSource.reviews ?? "")
        }

        // Images & Media
        setAdditionalImages(parseArray(p.images))
        setVideoPreview(p.video_preview ?? p.videoPreview ?? '')
        // Learning outcomes (map to p.technologies if present)
        setLearningOutcomes(parseArray(p.technologies))
        // Frequently bought together (store as addons slugs)
        setFrequentlyBought(parseArray(p.addons))
        // Why Choose (may live inside theme)
        setWhyChoose(parseArray((themeSource && (themeSource.why_choose || themeSource.whyChoose)) ?? p.why_choose ?? []))
        // Customer reviews (may live inside theme.customer_reviews)
        const reviewsRaw = (themeSource && (themeSource.customer_reviews || themeSource.reviewsList)) ?? p.customer_reviews ?? []
        const parsedReviews = parseArray(reviewsRaw).map((r:any) => ({
          name: r?.name ?? '',
          rating: r?.rating ?? '',
          title: r?.title ?? '',
          body: r?.body ?? '',
        }))
        setCustomerReviews(parsedReviews)
        
      } catch (e: any) {
        toast({ title: 'Failed to load product details', description: e?.message || String(e), variant: 'destructive' })
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [currentSlug, toast])

  // load all products for frequently-bought selector
  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) return
        const list = await res.json()
        if (ignore) return
        setAllProducts(Array.isArray(list) ? list.map((p:any) => ({ id: p.id, name: p.name, slug: p.slug })) : [])
      } catch (e) {
        // ignore
      }
    })()
    return () => { ignore = true }
  }, [])

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights(prev => [...prev, newHighlight.trim()])
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()])
      setNewFeature("")
    }
  }

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes(prev => [...prev, newOutcome.trim()])
      setNewOutcome("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications(prev => [...prev, { key: newSpecKey.trim(), value: newSpecValue.trim() }])
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index))
  }

  const addBoxItem = () => {
    if (newBoxItem.trim()) {
      setWhatInBox(prev => [...prev, newBoxItem.trim()])
      setNewBoxItem("")
    }
  }

  const removeBoxItem = (index: number) => {
    setWhatInBox(prev => prev.filter((_, i) => i !== index))
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setAdditionalImages(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
  }

  const toggleFrequentlyBought = (slug: string) => {
    setFrequentlyBought(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug])
  }

  // Why choose helpers
  const addWhy = () => {
    if (newWhy.trim()) {
      setWhyChoose(prev => [...prev, newWhy.trim()])
      setNewWhy("")
    }
  }
  const removeWhy = (index:number) => setWhyChoose(prev => prev.filter((_,i)=>i!==index))

  // Customer reviews helpers
  const addReview = () => {
    if (!reviewName.trim() || !reviewTitle.trim() || !reviewBody.trim() || reviewRating === "") return
    setCustomerReviews(prev => [...prev, { name: reviewName.trim(), rating: reviewRating, title: reviewTitle.trim(), body: reviewBody.trim() }])
    setReviewName("")
    setReviewRating("")
    setReviewTitle("")
    setReviewBody("")
  }
  const removeReview = (index:number) => setCustomerReviews(prev => prev.filter((_,i)=>i!==index))

  const onSubmit = async () => {
    try {
      // Convert specifications array to object
      const specsObject = specifications.reduce((acc, spec) => {
        acc[spec.key] = spec.value
        return acc
      }, {} as Record<string, string>)

      // Map to the API / DB column names that the product detail page expects.
      // - description instead of full_description
      // - tech_specs instead of specifications
      // - kits (or addons) is used for "what in box"
      // - theme holds warranty, delivery_date, stock_quantity and seller info
      // - hero_image / image will be set to the first additional image if provided
      // Merge with existing product data so we don't clobber unrelated fields
      const existing = basicProduct || {}
      const body = {
        // keep existing top-level fields unless explicitly changed in this form
        ...existing,
        name: existing.name || currentSlug,
        slug: currentSlug,
        category: category || existing.category || null,
        tagline: tagline || existing.tagline || null,
        // use description from this form or preserve existing description/full_description
        description: fullDescription || existing.description || existing.full_description || null,
        highlights: highlights.length ? highlights : (existing.highlights ?? null),
        features: features.length ? features : (existing.features ?? null),
        technologies: learningOutcomes.length ? learningOutcomes : (existing.technologies ?? null),
        tech_specs: Object.keys(specsObject).length ? specsObject : (existing.tech_specs ?? existing.specifications ?? null),
        kits: whatInBox.length ? whatInBox : (existing.kits ?? existing.addons ?? null),
        addons: frequentlyBought.length ? frequentlyBought : (existing.addons ?? null),
        delivery: deliveryInfo || existing.delivery || null,
        // Merge theme but prefer values set in this form
        theme: {
          ...(existing.theme || {}),
          warranty: warranty || existing?.theme?.warranty || null,
          delivery_date: deliveryDate || existing?.theme?.delivery_date || null,
          stock_quantity: stockQuantity !== "" ? stockQuantity : (existing?.theme?.stock_quantity ?? null),
          seller: (sellerName || sellerRating || sellerReviews) ? {
            name: sellerName || existing?.theme?.seller?.name || '',
            rating: sellerRating || existing?.theme?.seller?.rating || 0,
            reviews: sellerReviews || existing?.theme?.seller?.reviews || 0,
          } : (existing?.theme?.seller ?? null),
          why_choose: whyChoose.length ? whyChoose : (existing?.theme?.why_choose ?? null),
          customer_reviews: customerReviews.length ? customerReviews : (existing?.theme?.customer_reviews ?? null),
        },
        hero_image: additionalImages.length ? additionalImages[0] : (existing.hero_image || existing.image || null),
        image: additionalImages.length ? additionalImages[0] : (existing.image || null),
        images: additionalImages.length ? additionalImages : (existing.images ?? null),
        video_preview: videoPreview || existing.video_preview || null,
        // in_stock: if admin marked out of stock set it to false, otherwise preserve existing value or default true
        in_stock: isOutOfStock ? false : (existing.in_stock === undefined ? true : existing.in_stock),
        // Preserve storefront pricing & ratings if present
        price: existing.price ?? null,
        original_price: existing.original_price ?? null,
        rating: existing.rating ?? null,
        reviews: existing.reviews ?? null,
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || data?.message || `Failed (${res.status})`)

  toast({ title: 'Product details saved successfully!' })
  // Go straight to product detail so the admin can verify the dynamic data
  router.push(`/product/${currentSlug}`)
    } catch (e: any) {
      toast({ title: 'Failed to save details', description: e?.message || String(e), variant: 'destructive' })
    }
  }

  if (loading) return (
    <Protect>
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </AdminLayout>
    </Protect>
  )

  return (
    <Protect>
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Edit Product Details</h1>
              <p className="text-gray-600">Complete Amazon-style product information for {basicProduct.name}</p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>

          {/* Product Overview */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Product Overview</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Product Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((cat: string) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline / Short Description</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Brief, compelling description that appears below the title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Full Product Description</Label>
                  <Textarea
                    id="fullDescription"
                    rows={6}
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Detailed product description with features, benefits, and usage scenarios..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Outcomes (customer-facing benefits) */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Learning Outcomes</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    placeholder="Add a learning outcome"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addOutcome()
                      }
                    }}
                  />
                  <Button onClick={addOutcome} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {learningOutcomes.map((o, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{o}</span>
                      <Button variant="ghost" size="sm" onClick={() => setLearningOutcomes(prev => prev.filter((_, idx) => idx !== i))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose This Product */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Why choose this product</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newWhy}
                    onChange={(e) => setNewWhy(e.target.value)}
                    placeholder="Add a short bullet that explains why customers should choose this product"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addWhy() } }}
                  />
                  <Button onClick={addWhy} size="sm"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {whyChoose.map((w, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{w}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeWhy(i)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frequently bought together selector */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Frequently bought together</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Select products to show as "Frequently bought together" on the product page.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2">
                  {allProducts.map((p) => (
                    <label key={p.slug} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                      <input type="checkbox" checked={frequentlyBought.includes(p.slug)} onChange={() => toggleFrequentlyBought(p.slug)} />
                      <span className="text-sm">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights & Key Features */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Highlights & Key Features</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Highlights */}
                <div className="space-y-4">
                  <Label>Product Highlights (Appears in "About this item")</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        placeholder="Add a highlight point"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addHighlight()
                          }
                        }}
                      />
                      <Button onClick={addHighlight} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{highlight}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHighlight(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-4">
                  <Label>Key Features (Technical Features)</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a key feature"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addFeature()
                          }
                        }}
                      />
                      <Button onClick={addFeature} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">{feature}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Technical Specifications</h2>
              
              <div className="space-y-4">
                <Label>Product Specifications (Key-Value Pairs)</Label>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Input
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Specification name (e.g., Age Range)"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Specification value (e.g., 8-16 years)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSpecification()
                        }
                      }}
                    />
                    <Button onClick={addSpecification}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 border rounded-lg p-4">
                  {specifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No specifications added yet</p>
                  ) : (
                    specifications.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <span className="font-medium">{spec.key}</span>
                          <span className="text-gray-600">{spec.value}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpecification(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's in the Box */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">What's in the Box</h2>
              
              <div className="space-y-4">
                <Label>Items Included in the Package</Label>
                <div className="flex gap-2">
                  <Input
                    value={newBoxItem}
                    onChange={(e) => setNewBoxItem(e.target.value)}
                    placeholder="Add an item included in the box"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addBoxItem()
                      }
                    }}
                  />
                  <Button onClick={addBoxItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-2">
                  {whatInBox.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span>{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBoxItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Stock Information */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Delivery & Stock Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="deliveryInfo">Delivery Information</Label>
                  <Input
                    id="deliveryInfo"
                    value={deliveryInfo}
                    onChange={(e) => setDeliveryInfo(e.target.value)}
                    placeholder="e.g., FREE delivery, Express delivery"
                  />
                  
                  <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    placeholder="e.g., Tomorrow, 25 December"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Available quantity"
                  />
                  
                  <Label htmlFor="warranty">Warranty Information</Label>
                  <Input
                    id="warranty"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g., 1 year manufacturer warranty"
                  />
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="outOfStock"
                      type="checkbox"
                      checked={isOutOfStock}
                      onChange={(e) => setIsOutOfStock(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="outOfStock" className="mb-0">Mark as Out of Stock (hide 'Out of Stock' badge when unchecked)</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Information */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Seller Information</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sellerName">Seller Name</Label>
                  <Input
                    id="sellerName"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g., STEMLearning Official"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sellerRating">Seller Rating (1-5)</Label>
                  <Input
                    id="sellerRating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={sellerRating}
                    onChange={(e) => setSellerRating(e.target.value ? Number(e.target.value) : "")}
                    placeholder="4.8"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sellerReviews">Seller Reviews Count</Label>
                  <Input
                    id="sellerReviews"
                    type="number"
                    value={sellerReviews}
                    onChange={(e) => setSellerReviews(e.target.value ? Number(e.target.value) : "")}
                    placeholder="1250"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media & Images */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Media & Images</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Additional Product Images</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Image URL"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addImage()
                        }
                      }}
                    />
                    <Button onClick={addImage}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {additionalImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product view ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoPreview">Video Preview URL</Label>
                  <Input
                    id="videoPreview"
                    value={videoPreview}
                    onChange={(e) => setVideoPreview(e.target.value)}
                    placeholder="URL to product video preview"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews (admin-managed) */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold border-b pb-2">Customer reviews</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-4 gap-2">
                  <Input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Reviewer name" />
                  <Input type="number" value={String(reviewRating)} onChange={(e) => setReviewRating(e.target.value ? Number(e.target.value) : "")} placeholder="Rating (1-5)" />
                  <Input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} placeholder="Review title" />
                  <Button onClick={addReview}><Plus className="h-4 w-4" /></Button>
                </div>
                <div>
                  <Textarea value={reviewBody} onChange={(e) => setReviewBody(e.target.value)} placeholder="Review body" rows={3} />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {customerReviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No customer reviews added yet</p>
                  ) : (
                    customerReviews.map((r, i) => (
                      <div key={i} className="border-b last:border-b-0 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{r.name} <span className="text-sm text-gray-500">• {r.rating}★</span></div>
                            <div className="text-sm font-semibold">{r.title}</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeReview(i)}><X className="h-4 w-4" /></Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{r.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={onSubmit} size="lg">
              Save All Product Details
            </Button>
          </div>
        </div>
      </AdminLayout>
    </Protect>
  )
}