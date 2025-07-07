"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Users, CheckCircle } from "lucide-react"

export default function AddBatchPage() {
  const steps = [
    { id: "basic", title: "Basic info", icon: <User className="h-4 w-4" /> },
    { id: "students", title: "Students", icon: <Users className="h-4 w-4" /> },
    { id: "finish", title: "Finish", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  const stepContent = [
    // Basic Info Step
    <div key="basic" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="batchName">
          Batch Name<span className="text-red-500">*</span>
        </Label>
        <Input id="batchName" placeholder="Enter batch name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="trainer">
          Add trainer<span className="text-red-500">*</span>
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose Trainer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trainer1">furqan syed</SelectItem>
            <SelectItem value="trainer2">Snehal s</SelectItem>
            <SelectItem value="trainer3">Dummy trainer</SelectItem>
            <SelectItem value="trainer4">humanity trainer</SelectItem>
            <SelectItem value="trainer5">karim shaikh</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">
          Add course<span className="text-red-500">*</span>
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="course1">ROBO SENIOR</SelectItem>
            <SelectItem value="course2">PROTON-BLOCKS</SelectItem>
            <SelectItem value="course3">test final course</SelectItem>
            <SelectItem value="course4">Web Development Fundamentals</SelectItem>
            <SelectItem value="course5">Data Science with Python</SelectItem>
          </SelectContent>
        </Select>
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

    // Students Step
    <div key="students" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="maxStudents">Maximum Students</Label>
        <Input id="maxStudents" type="number" placeholder="Enter maximum number of students" defaultValue="30" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule">Schedule</Label>
        <Input id="schedule" placeholder="Enter batch schedule (e.g., Mon-Fri 10:00-12:00)" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Enter batch description" />
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
      <MultiStepForm title="Batch add" steps={steps} onSubmit={() => console.log("Form submitted")}>
        {stepContent}
      </MultiStepForm>
    </AdminLayout>
  )
}
