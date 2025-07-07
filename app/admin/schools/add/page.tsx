"use client"

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
  const steps = [
    { id: "basic", title: "Basic info", icon: <User className="h-4 w-4" /> },
    { id: "credentials", title: "Login credentials", icon: <Lock className="h-4 w-4" /> },
    { id: "social", title: "Social information", icon: <Share2 className="h-4 w-4" /> },
    { id: "finish", title: "Finish", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="schoolName">
          School Name<span className="text-red-500">*</span>
        </Label>
        <Input id="schoolName" placeholder="Enter school name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="board">
          Board<span className="text-red-500">*</span>
        </Label>
        <Select defaultValue="cbse">
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
        <Select>
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
        <Select>
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
        <Textarea id="about" placeholder="Enter school description" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Address<span className="text-red-500">*</span>
        </Label>
        <Textarea id="address" placeholder="Enter school address" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolLogo">
          School logo<span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-4">
          <Input id="schoolLogo" placeholder="Choose School logo" readOnly />
          <Button variant="outline">Browse</Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolImages">School images</Label>
        <div className="flex items-center gap-4">
          <Input id="schoolImages" placeholder="Choose School images" readOnly />
          <Button variant="outline">Browse</Button>
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
        <Input id="email" type="email" placeholder="Enter email address" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone<span className="text-red-500">*</span>
        </Label>
        <Input id="phone" placeholder="Enter phone number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPerson">
          Contact Person<span className="text-red-500">*</span>
        </Label>
        <Input id="contactPerson" placeholder="Enter contact person name" />
      </div>
    </div>,

    // Social Information Step
    <div key="social" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input id="website" placeholder="Enter website URL" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facebook">Facebook Page</Label>
        <Input id="facebook" placeholder="Enter Facebook URL" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" placeholder="Enter Instagram URL" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitter">Twitter</Label>
        <Input id="twitter" placeholder="Enter Twitter URL" />
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
      <MultiStepForm title="School add form" steps={steps} onSubmit={() => console.log("Form submitted")}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
  )
}
