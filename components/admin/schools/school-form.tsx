"use client"

import { useEffect, useState } from "react"
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
  stateVal: string
  district: string
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
  const [stateVal, setStateVal] = useState(initial?.stateVal ?? "")
  const [district, setDistrict] = useState(initial?.district ?? "")
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

  const steps = [
    { id: "basic", title: "Basic info", icon: User },
    { id: "credentials", title: "Login credentials", icon: Lock },
    { id: "social", title: "Social information", icon: Share2 },
    { id: "finish", title: "Finish", icon: CheckCircle },
  ]

  const handleComplete = async () => {
    const errs: string[] = []
    if (!name.trim()) errs.push("School name is required")
    if (!stateVal) errs.push("State is required")
    if (!district) errs.push("District is required")
    if (!address.trim()) errs.push("Address is required")
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push("Invalid email format")
    const urlOk = (u: string) => /^https?:\/\//i.test(u)
    if (website && !urlOk(website)) errs.push("Website must start with http(s)://")
    if (facebook && !urlOk(facebook)) errs.push("Facebook URL must start with http(s)://")
    if (instagram && !urlOk(instagram)) errs.push("Instagram URL must start with http(s)://")
    if (twitter && !urlOk(twitter)) errs.push("Twitter URL must start with http(s)://")
    if (errs.length) { alert(errs.join("\n")); return }

    await onSubmit({
      name, board, stateVal, district, description, address,
      logoFile, bannerFile, email, phone, contactPerson,
      website, facebook, instagram, twitter,
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
        <Label htmlFor="state">
          State<span className="text-red-500">*</span>
        </Label>
        <Select value={stateVal} onValueChange={setStateVal}>
          <SelectTrigger>
            <SelectValue placeholder="Choose State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maharashtra">Maharashtra</SelectItem>
            <SelectItem value="gujarat">Gujarat</SelectItem>
            <SelectItem value="karnataka">Karnataka</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="district">
          District<span className="text-red-500">*</span>
        </Label>
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger>
            <SelectValue placeholder="Choose District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="pune">Pune</SelectItem>
            <SelectItem value="nashik">Nashik</SelectItem>
            <SelectItem value="nagpur">Nagpur</SelectItem>
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
