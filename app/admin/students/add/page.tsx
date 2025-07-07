"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock, Share2, CheckCircle } from "lucide-react"

export default function AddStudentPage() {
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
        <Label htmlFor="school">
          School<span className="text-red-500">*</span>
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose School" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="school1">Vrindavan -aiskool</SelectItem>
            <SelectItem value="school2">humanitypublicschool</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First name<span className="text-red-500">*</span>
          </Label>
          <Input id="firstName" placeholder="Enter first name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last name<span className="text-red-500">*</span>
          </Label>
          <Input id="lastName" placeholder="Enter last name" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="biography">Biography</Label>
        <div className="border rounded-lg">
          <div className="border-b p-2 flex items-center gap-2 text-sm">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="font-bold">B</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="italic">I</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="underline">U</span>
            </Button>
            <div className="w-px h-4 bg-gray-300" />
            <Button variant="ghost" size="sm" className="h-8 px-2">
              Nunito
            </Button>
          </div>
          <Textarea
            id="biography"
            placeholder="Write something..."
            className="border-0 resize-none focus-visible:ring-0"
            rows={8}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userImage">User image</Label>
        <div className="flex items-center gap-4">
          <Input id="userImage" placeholder="Choose user image" readOnly />
          <Button variant="outline">Browse</Button>
        </div>
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

    // Social Information Step
    <div key="social" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" placeholder="Enter phone number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
        <Input id="parentPhone" placeholder="Enter parent/guardian phone" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" placeholder="Enter address" rows={4} />
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
      <MultiStepForm title="Student add" steps={steps} onSubmit={() => console.log("Form submitted")}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
  )
}
