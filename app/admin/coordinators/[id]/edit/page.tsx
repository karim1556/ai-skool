"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock, GraduationCap, Share2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Protect } from "@clerk/nextjs"

export default function EditCoordinatorPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = useMemo(() => (Array.isArray(params?.id) ? params.id[0] : params?.id) as string, [params])
  const { toast } = useToast()

  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [schoolId, setSchoolId] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("male")
  const [dob, setDob] = useState("")
  const [pincode, setPincode] = useState("")
  const [address, setAddress] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState("verified")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [highestSchool, setHighestSchool] = useState("")
  const [experienceYears, setExperienceYears] = useState<string | number>("")
  const [organization, setOrganization] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [alternatePhone, setAlternatePhone] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [bio, setBio] = useState("")

  const steps = [
    { id: "basic", title: "Basic info", icon: User },
    { id: "credentials", title: "Login credentials", icon: Lock },
    { id: "qualification", title: "Qualification", icon: GraduationCap },
    { id: "social", title: "Social information", icon: Share2 },
    { id: "finish", title: "Finish", icon: CheckCircle },
  ]

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="school">School</Label>
        <Select value={schoolId} onValueChange={setSchoolId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose School" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name<span className="text-red-500">*</span>
          </Label>
          <Input id="firstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name<span className="text-red-500">*</span>
          </Label>
          <Input id="lastName" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        <Label>
          Gender<span className="text-red-500">*</span>
        </Label>
        <RadioGroup value={gender} onValueChange={setGender} className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth<span className="text-red-500">*</span></Label>
        <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pincode">Pincode<span className="text-red-500">*</span></Label>
        <Input id="pincode" placeholder="Enter pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" placeholder="Enter address" rows={4} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userImage">User image</Label>
        <div className="flex items-center gap-4">
          <Input id="userImage" placeholder="Choose user image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <span className="text-sm text-muted-foreground">(paste image URL)</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label>
          Status<span className="text-red-500">*</span>
        </Label>
        <RadioGroup value={status} onValueChange={setStatus} className="flex gap-6">
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
        <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
        <Input id="email" type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter new password (optional)" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
    </div>,

    // Qualification Step
    <div key="qualification" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="Skool">Highest Skool</Label>
        <Input id="Skool" placeholder="Enter highest Skool" value={highestSchool} onChange={(e) => setHighestSchool(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">Experience (Years)</Label>
        <Input id="experience" type="number" placeholder="Enter years of experience" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Input id="organization" placeholder="Enter organization name" value={organization} onChange={(e) => setOrganization(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="responsibilities">Key Responsibilities</Label>
        <Textarea id="responsibilities" placeholder="Enter key responsibilities" rows={4} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
      </div>
    </div>,

    // Social Information Step
    <div key="social" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="alternatePhone">Alternate Phone</Label>
        <Input id="alternatePhone" placeholder="Enter alternate phone number" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input id="linkedin" placeholder="Enter LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" placeholder="Enter bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
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

  useEffect(() => {
    const load = async () => {
      try {
        const [schRes, coordRes] = await Promise.all([
          fetch("/api/schools", { cache: "no-store" }),
          fetch(`/api/coordinators?id=${id}`, { cache: "no-store" }),
        ])
        const [sch, rows] = await Promise.all([schRes.json(), coordRes.json()])
        setSchools(Array.isArray(sch) ? sch : [])
        const c = Array.isArray(rows) ? rows[0] : null
        if (c) {
          setSchoolId(c.school_id || "")
          setFirstName(c.first_name || "")
          setLastName(c.last_name || "")
          setEmail(c.email || "")
          setPhone(c.phone || "")
          setGender(c.gender || "male")
          setDob(c.dob ? String(c.dob).slice(0, 10) : "")
        }
        if (c) {
          setPincode(c.pincode || "")
          setAddress(c.address || "")
          setImageUrl(c.image_url || "")
          setStatus(c.status || "verified")
          setHighestSchool(c.highest_school || "")
          setExperienceYears(typeof c.experience_years !== 'undefined' && c.experience_years !== null ? String(c.experience_years) : "")
          setOrganization(c.organization || "")
          setResponsibilities(c.responsibilities || "")
          setAlternatePhone(c.alternate_phone || "")
          setLinkedin(c.linkedin || "")
          setBio(c.bio || "")
        }
      } catch (e: any) {
        toast({ title: "Error", description: e?.message || String(e) || "Failed to load coordinator", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id, toast])

  const handleSave = async () => {
    try {
      if (password && password !== confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" })
        return
      }
      setSaving(true)
      const res = await fetch(`/api/coordinators?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: schoolId || null,
          first_name: firstName || null,
          last_name: lastName || null,
          email: email || null,
          phone: phone || null,
          gender: gender || null,
          dob: dob || null,
          pincode: pincode || null,
          address: address || null,
          image_url: imageUrl || null,
          status: status || null,
          password: password ? password : undefined,
          highest_school: highestSchool || null,
          experience_years: experienceYears === "" ? null : Number(experienceYears),
          organization: organization || null,
          responsibilities: responsibilities || null,
          alternate_phone: alternatePhone || null,
          linkedin: linkedin || null,
          bio: bio || null,
        }),
      })
      if (res.status === 409) {
        const data = await res.json().catch(async () => ({ error: await res.text().catch(() => "Conflict") }))
        toast({ title: `409 Conflict`, description: data?.error || "Coordinator already exists for this school", variant: "destructive" })
        return
      }
      let data: any = null
      try { data = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => "Failed to update coordinator"))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      toast({ title: "Coordinator updated" })
      router.push("/admin/coordinators")
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || String(e) || "Failed to update coordinator", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Protect
      role="admin"
      fallback={<p>Access denied</p>}
      >
      <AdminLayout>
        <div className="p-6">Loading...</div>
      </AdminLayout>
      </Protect>
    )
  }

  return (
    <Protect
    role="admin"
    fallback={<p>Access denied</p>}
    >
    <AdminLayout>
      <MultiStepForm steps={steps} onComplete={handleSave}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
    </Protect>
  )
}
