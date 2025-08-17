"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock, Share2, CheckCircle } from "lucide-react"

export default function AddSchoolPage() {
  const router = useRouter()

  // Basic info
  const [name, setName] = useState("")
  const [board, setBoard] = useState("cbse")
  const [stateVal, setStateVal] = useState("")
  const [district, setDistrict] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  // Contact
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [contactPerson, setContactPerson] = useState("")

  // Social
  const [website, setWebsite] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [twitter, setTwitter] = useState("")

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
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
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("name", name)
      fd.append("tagline", board) // reuse board as tagline-like meta
      fd.append("description", description)
      fd.append("email", email)
      fd.append("phone", phone)
      fd.append("principal", contactPerson)
      fd.append("address_line1", address)
      fd.append("city", district)
      fd.append("state", stateVal)
      fd.append("website", website)
      if (logoFile) fd.append("logo", logoFile)
      if (bannerFile) fd.append("banner", bannerFile)
      const social = { facebook, instagram, twitter }
      fd.append("social_links", JSON.stringify(social))

      const res = await fetch("/api/schools", { method: "POST", body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Failed to create school")
      }
      router.push("/admin/schools")
    } catch (e: any) {
      alert(e.message || "Failed to create school")
    } finally {
      setSubmitting(false)
    }
  }
  const steps = [
    { id: "basic", title: "Basic info", icon: User },
    { id: "credentials", title: "Login credentials", icon: Lock },
    { id: "social", title: "Social information", icon: Share2 },
    { id: "finish", title: "Finish", icon: CheckCircle },
  ]

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
        <Select defaultValue="cbse" onValueChange={setBoard}>
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
        <Select onValueChange={setStateVal}>
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
        <Select onValueChange={setDistrict}>
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
          School logo<span className="text-red-500">*</span>
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
    <AdminLayout>
      <MultiStepForm steps={steps} onComplete={handleSubmit}>
        {stepContent}
      </MultiStepForm>
      <div className="mt-6">
        <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">
          {submitting ? "Saving..." : "Save School"}
        </Button>
      </div>
    </AdminLayout>
  )
}
