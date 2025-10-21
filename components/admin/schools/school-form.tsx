"use client"

import React, { useEffect, useState, useRef } from "react"
import { Country, State, City } from 'country-state-city';
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock, Share2, CheckCircle } from "lucide-react"

export type SchoolFormValues = {
  name: string
  board: string
  country: string
  stateVal: string
  city: string
  district?: string
  description: string
  address: string
  logoFile: File | null
  bannerFile: File | null
  email: string
  phone: string
  contactPerson: string
  website: string
  facebook: string
  instagram: string
  twitter: string
  banner_focal_x?: number
  banner_focal_y?: number
}

export function SchoolForm({
  initial,
  submitting,
  onSubmit,
  submitLabel = "Save School",
}: {
  initial?: Partial<SchoolFormValues>
  submitting?: boolean
  onSubmit: (values: SchoolFormValues) => Promise<void> | void
  submitLabel?: string
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [board, setBoard] = useState(initial?.board ?? "cbse")
  const [country, setCountry] = useState(initial?.country ?? "IN")
  const [stateVal, setStateVal] = useState(initial?.stateVal ?? "")
  const [city, setCity] = useState(initial?.city ?? "")
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  // Load states when country changes
  useEffect(() => {
    if (!country) return;
    const stateList = State.getStatesOfCountry(country);
    setStates(stateList);
    setStateVal("");
    setCities([]);
    setCity("");
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (!country || !stateVal) return;
    const cityList = City.getCitiesOfState(country, stateVal);
    setCities(cityList);
    setCity("");
  }, [country, stateVal]);
  const [description, setDescription] = useState(initial?.description ?? "")
  const [address, setAddress] = useState(initial?.address ?? "")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [email, setEmail] = useState(initial?.email ?? "")
  const [phone, setPhone] = useState(initial?.phone ?? "")
  const [contactPerson, setContactPerson] = useState(initial?.contactPerson ?? "")
  const [website, setWebsite] = useState(initial?.website ?? "")
  const [facebook, setFacebook] = useState(initial?.facebook ?? "")
  const [instagram, setInstagram] = useState(initial?.instagram ?? "")
  const [twitter, setTwitter] = useState(initial?.twitter ?? "")
  const [bannerFocalX, setBannerFocalX] = useState<number>(
    typeof (initial as any)?.banner_focal_x === 'number' ? (initial as any).banner_focal_x : 50
  )
  const [bannerFocalY, setBannerFocalY] = useState<number>(
    typeof (initial as any)?.banner_focal_y === 'number' ? (initial as any).banner_focal_y : 50
  )

  // Banner preview URL for interactive focal control
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null)
  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile)
      setBannerPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setBannerPreviewUrl(null)
    }
  }, [bannerFile])

  const steps = [
    { id: "basic", title: "Basic info", icon: User },
    { id: "credentials", title: "Login credentials", icon: Lock },
    { id: "social", title: "Social information", icon: Share2 },
    { id: "finish", title: "Finish", icon: CheckCircle },
  ]

  const handleComplete = async () => {
    const errs: string[] = []
    if (!name.trim()) errs.push("School name is required")
    if (!country) errs.push("Country is required")
    if (!stateVal) errs.push("State is required")
    if (!city) errs.push("District is required")
    if (!address.trim()) errs.push("Address is required")
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push("Invalid email format")
    const urlOk = (u: string) => /^https?:\/\//i.test(u)
    if (website && !urlOk(website)) errs.push("Website must start with http(s)://")
    if (facebook && !urlOk(facebook)) errs.push("Facebook URL must start with http(s)://")
    if (instagram && !urlOk(instagram)) errs.push("Instagram URL must start with http(s)://")
    if (twitter && !urlOk(twitter)) errs.push("Twitter URL must start with http(s)://")
    if (errs.length) { alert(errs.join("\n")); return }

    await onSubmit({
      name, board, country, stateVal, city, district: city, description, address,
      logoFile, bannerFile, email, phone, contactPerson,
      website, facebook, instagram, twitter,
      banner_focal_x: Math.round(bannerFocalX),
      banner_focal_y: Math.round(bannerFocalY),
    })
  }

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="schoolName">
          School Name<span className="text-red-500">*</span>
        </Label>
        <Input id="schoolName" placeholder="Enter school name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="board">
          Board<span className="text-red-500">*</span>
        </Label>
        <Select defaultValue={board} onValueChange={setBoard}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cbse">CBSE</SelectItem>
            <SelectItem value="icse">ICSE</SelectItem>
            <SelectItem value="state">State Board</SelectItem>
            <SelectItem value="ib">IB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">
          Country<span className="text-red-500">*</span>
        </Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Country" />
          </SelectTrigger>
          <SelectContent>
            {Country.getAllCountries().map((c) => (
              <SelectItem key={c.isoCode} value={c.isoCode}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">
          State<span className="text-red-500">*</span>
        </Label>
        <Select value={stateVal} onValueChange={setStateVal} disabled={!states.length}>
          <SelectTrigger>
            <SelectValue placeholder="Choose State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.isoCode} value={s.isoCode}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">
          City<span className="text-red-500">*</span>
        </Label>
        <Select value={city} onValueChange={setCity} disabled={!cities.length}>
          <SelectTrigger>
            <SelectValue placeholder="Choose City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((ct) => (
              <SelectItem key={ct.name} value={ct.name}>{ct.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Textarea id="about" placeholder="Enter school description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Address<span className="text-red-500">*</span>
        </Label>
        <Textarea id="address" placeholder="Enter school address" rows={4} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolLogo">
          School logo
        </Label>
        <div className="flex items-center gap-4">
          <Input id="schoolLogo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.currentTarget.files?.[0] || null)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolImages">School images</Label>
        <div className="flex items-center gap-4">
          <Input id="schoolImages" type="file" accept="image/*" onChange={(e) => setBannerFile(e.currentTarget.files?.[0] || null)} />
        </div>
      </div>

      {/* Interactive Banner Focal Preview */}
      {bannerPreviewUrl && (
        <div className="space-y-2">
          <Label>Banner preview (drag to adjust focus)</Label>
          <BannerFocalPreview
            src={bannerPreviewUrl}
            focalX={bannerFocalX}
            focalY={bannerFocalY}
            onChange={(x, y) => { setBannerFocalX(x); setBannerFocalY(y) }}
          />
          <div className="text-xs text-gray-500">Visible area matches the hero banner (16:9). Drag the image to position the important part within the frame. Outside area is not shown on the page.</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bannerFocalX">Banner focal X (0–100%)</Label>
          <input id="bannerFocalX" type="range" min={0} max={100} value={bannerFocalX} onChange={(e)=>setBannerFocalX(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600">{bannerFocalX}%</div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bannerFocalY">Banner focal Y (0–100%)</Label>
          <input id="bannerFocalY" type="range" min={0} max={100} value={bannerFocalY} onChange={(e)=>setBannerFocalY(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600">{bannerFocalY}%</div>
        </div>
      </div>

      {/* Sub-component is defined at module scope below */}

      <div className="space-y-3">
        <Label>
          Status<span className="text-red-500">*</span>
        </Label>
        <RadioGroup defaultValue="verified" className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="verified" id="verified" />
            <Label htmlFor="verified">Verified</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unverified" id="unverified" />
            <Label htmlFor="unverified">Unverified</Label>
          </div>
        </RadioGroup>
      </div>
    </div>,

    // Login Credentials Step
    <div key="credentials" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">
          Email<span className="text-red-500">*</span>
        </Label>
        <Input id="email" type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone<span className="text-red-500">*</span>
        </Label>
        <Input id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPerson">
          Contact Person<span className="text-red-500">*</span>
        </Label>
        <Input id="contactPerson" placeholder="Enter contact person name" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
      </div>
    </div>,

    // Social Information Step
    <div key="social" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input id="website" placeholder="Enter website URL" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facebook">Facebook Page</Label>
        <Input id="facebook" placeholder="Enter Facebook URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" placeholder="Enter Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter</Label>
        <Input id="twitter" placeholder="Enter Twitter URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
      </div>
    </div>,

    // Finish Step
    <div key="finish" className="space-y-6 text-center">
      <div className="space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">Review Your Information</h3>
        <p className="text-gray-600">Please review all the information you have entered before submitting.</p>
      </div>
    </div>,
  ]

  return (
    <div>
      <MultiStepForm steps={steps} onComplete={handleComplete}>
        {stepContent}
      </MultiStepForm>
      <div className="mt-6">
        <Button onClick={handleComplete} disabled={!!submitting} className="bg-green-600 hover:bg-green-700">
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </div>
  )
}

// Module-scope sub-component used by SchoolForm
function BannerFocalPreview({ src, focalX, focalY, onChange }: { src: string, focalX: number, focalY: number, onChange: (x:number, y:number)=>void }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const lastRef = useRef<{x:number,y:number}>({x:0,y:0})

  const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n))

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    lastRef.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastRef.current.x
    const dy = e.clientY - lastRef.current.y
    lastRef.current = { x: e.clientX, y: e.clientY }
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const deltaXPercent = (dx / rect.width) * 100
    const deltaYPercent = (dy / rect.height) * 100
    const nextX = clamp(focalX - deltaXPercent)
    const nextY = clamp(focalY - deltaYPercent)
    onChange(nextX, nextY)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) } catch {}
  }

  const objectPosition = `${clamp(focalX)}% ${clamp(focalY)}%`

  return (
    <div className="w-full bg-gray-200 rounded-lg p-3">
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] overflow-hidden rounded-md ring-1 ring-gray-300 bg-black/60"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={src}
          alt="Banner preview"
          className="absolute inset-0 w-full h-full object-cover select-none"
          style={{ objectPosition }}
          draggable={false}
        />
        {/* Optional crosshair to indicate focus */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" />
        </div>
      </div>
    </div>
  )
}
