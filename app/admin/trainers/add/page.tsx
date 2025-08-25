"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Lock, GraduationCap, Share2, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Protect } from "@clerk/nextjs"

export default function AddTrainerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([])
  const [coordinators, setCoordinators] = useState<Array<{ id: string; first_name: string; last_name: string }>>([])
  const [schoolId, setSchoolId] = useState<string>("")
  const [coordinatorId, setCoordinatorId] = useState<string>("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gender, setGender] = useState<string>("male")
  const [dob, setDob] = useState<string>("")
  const [pincode, setPincode] = useState("")
  const [address, setAddress] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState<string>("verified")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [highestSchool, setHighestSchool] = useState("")
  const [experienceYears, setExperienceYears] = useState<string>("")
  const [specialization, setSpecialization] = useState("")
  const [certifications, setCertifications] = useState("")
  const [phone, setPhone] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [twitter, setTwitter] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const res = await fetch("/api/schools")
        const data = await res.json()
        setSchools(Array.isArray(data) ? data : [])
        // preselect from URL if present and exists
        const sp = searchParams?.get("schoolId")
        if (sp && Array.isArray(data) && data.some((s: any) => s.id === sp)) {
          setSchoolId(sp)
        }
      } catch (_) {}
    }
    loadSchools()
  }, [searchParams])

  useEffect(() => {
    const loadCoordinators = async () => {
      if (!schoolId) {
        setCoordinators([])
        setCoordinatorId("")
        return
      }
      try {
        const res = await fetch(`/api/coordinators?schoolId=${schoolId}`)
        const data = await res.json()
        setCoordinators(Array.isArray(data) ? data : [])
      } catch (_) {}
    }
    loadCoordinators()
  }, [schoolId])

  const steps = [
    { id: "basic", title: "Basic info", icon: User },
    { id: "credentials", title: "Login credentials", icon: Lock },
    { id: "qualification", title: "Qualification", icon: GraduationCap },
    { id: "social", title: "Social information", icon: Share2 },
    { id: "finish", title: "Finish", icon: CheckCircle },
  ]

  const handleComplete = async () => {
    try {
      if (password && password !== confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" })
        return
      }
      const postUrl = schoolId ? `/api/trainers?schoolId=${encodeURIComponent(schoolId)}` : "/api/trainers"
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinator_id: coordinatorId || null,
          first_name: firstName || null,
          last_name: lastName || null,
          gender: gender || null,
          dob: dob || null,
          pincode: pincode || null,
          address: address || null,
          image_url: imageUrl || null,
          status: status || "verified",
          email: email || null,
          password: password || null,
          highest_school: highestSchool || null,
          experience_years: experienceYears ? Number(experienceYears) : null,
          specialization: specialization || null,
          certifications: certifications || null,
          phone: phone || null,
          linkedin: linkedin || null,
          twitter: twitter || null,
          bio: bio || null,
        }),
      })
      let data: any = null
      try {
        data = await res.json()
      } catch (_) {
        // non-JSON
      }
      if (!res.ok) {
        const msg = data?.error || data?.message || (await res.text().catch(() => "Failed to create trainer"))
        throw new Error(`${res.status} ${res.statusText}: ${msg}`)
      }
      toast({ title: "Trainer created" })
      router.push("/admin/trainers")
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || String(e) || "Failed to create trainer", variant: "destructive" })
    }
  }

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="school">
          School
        </Label>
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
      <div className="space-y-2">
        <Label htmlFor="coordinator">Coordinator (by school)</Label>
        <Select value={coordinatorId} onValueChange={setCoordinatorId} disabled={!schoolId || coordinators.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder={schoolId ? (coordinators.length ? "Choose Coordinator" : "No coordinator found") : "Choose school first"} />
          </SelectTrigger>
          <SelectContent>
            {coordinators.map((c) => (
              <SelectItem key={c.id} value={c.id}>{`${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() || c.id}</SelectItem>
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
        <Label htmlFor="dob">
          Date of Birth<span className="text-red-500">*</span>
        </Label>
        <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pincode">Pincode</Label>
        <Input id="pincode" placeholder="Enter pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" placeholder="Enter address" rows={4} value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImage">Profile Image</Label>
        <Input id="profileImage" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
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
        <Label htmlFor="email">
          Email<span className="text-red-500">*</span>
        </Label>
        <Input id="email" type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password<span className="text-red-500">*</span>
        </Label>
        <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm Password<span className="text-red-500">*</span>
        </Label>
        <Input id="confirmPassword" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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
        <Label htmlFor="specialization">Specialization</Label>
        <Input id="specialization" placeholder="Enter specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications</Label>
        <Textarea id="certifications" placeholder="Enter certifications" rows={4} value={certifications} onChange={(e) => setCertifications(e.target.value)} />
      </div>
    </div>,

    // Social Information Step
    <div key="social" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input id="linkedin" placeholder="Enter LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter Profile</Label>
        <Input id="twitter" placeholder="Enter Twitter URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
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

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>  
    <AdminLayout>
      <MultiStepForm steps={steps} onComplete={handleComplete}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
    </Protect>
  )
}
