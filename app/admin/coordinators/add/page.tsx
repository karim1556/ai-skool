"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Lock, GraduationCap, Share2, CheckCircle } from "lucide-react"

export default function AddCoordinatorPage() {
  const steps = [
    { id: "basic", title: "Basic info", icon: <User className="h-4 w-4" /> },
    { id: "credentials", title: "Login credentials", icon: <Lock className="h-4 w-4" /> },
    { id: "qualification", title: "Qualification", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "social", title: "Social information", icon: <Share2 className="h-4 w-4" /> },
    { id: "finish", title: "Finish", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name<span className="text-red-500">*</span>
          </Label>
          <Input id="firstName" placeholder="Enter first name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name<span className="text-red-500">*</span>
          </Label>
          <Input id="lastName" placeholder="Enter last name" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>
          Gender<span className="text-red-500">*</span>
        </Label>
        <RadioGroup defaultValue="male" className="flex gap-6">
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
        <Input id="dob" type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pincode">
          Pincode<span className="text-red-500">*</span>
        </Label>
        <Input id="pincode" placeholder="Enter pincode" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" placeholder="Enter address" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userImage">User image</Label>
        <div className="flex items-center gap-4">
          <Input id="userImage" placeholder="Choose user image" readOnly />
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
        <Label htmlFor="password">
          Password<span className="text-red-500">*</span>
        </Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm Password<span className="text-red-500">*</span>
        </Label>
        <Input id="confirmPassword" type="password" placeholder="Confirm password" />
      </div>
    </div>,

    // Qualification Step
    <div key="qualification" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="education">Highest Education</Label>
        <Input id="education" placeholder="Enter highest education" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience (Years)</Label>
        <Input id="experience" type="number" placeholder="Enter years of experience" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Input id="organization" placeholder="Enter organization name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibilities">Key Responsibilities</Label>
        <Textarea id="responsibilities" placeholder="Enter key responsibilities" rows={4} />
      </div>
    </div>,

    // Social Information Step
    <div key="social" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" placeholder="Enter phone number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternatePhone">Alternate Phone</Label>
        <Input id="alternatePhone" placeholder="Enter alternate phone number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input id="linkedin" placeholder="Enter LinkedIn URL" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" placeholder="Enter bio" rows={4} />
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
      <MultiStepForm title="Coordinator add" steps={steps} onSubmit={() => console.log("Form submitted")}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
  )
}
