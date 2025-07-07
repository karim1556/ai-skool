"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { courseTabs } from "@/lib/course-tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddCoursePage() {
  const router = useRouter()
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    requirements: "",
    outcomes: "",
    pricing: "free",
    price: "",
    mediaProvider: "youtube",
    mediaUrl: "",
    thumbnail: null as File | null,
    metaKeywords: "",
    metaDescription: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setCourseData({ ...courseData, [field]: value })
  }

  const handleComplete = (data: any) => {
    console.log("Course created:", { ...courseData, ...data })
    // Here you would typically save to database
    router.push("/admin/courses")
  }

  const steps = [
    // Curriculum Tab
    <div key="curriculum" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Curriculum</h2>
      <p className="text-gray-600">Set up your course structure with sections and lessons.</p>
      <div className="bg-blue-50 p-6 rounded-lg">
        <p className="text-blue-800">
          You can add sections, lessons, quizzes, and assignments after creating the basic course information.
        </p>
      </div>
    </div>,

    // Basic Tab
    <div key="basic" className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Information</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="title">Course Title *</Label>
          <Input
            id="title"
            value={courseData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter course title"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Course Description *</Label>
          <Textarea
            id="description"
            value={courseData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter course description"
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={courseData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>,

    // Requirements Tab
    <div key="requirements" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Requirements</h2>
      <div>
        <Label htmlFor="requirements">Prerequisites</Label>
        <Textarea
          id="requirements"
          value={courseData.requirements}
          onChange={(e) => handleInputChange("requirements", e.target.value)}
          placeholder="List any prerequisites for this course"
          rows={4}
        />
      </div>
    </div>,

    // Outcomes Tab
    <div key="outcomes" className="space-y-6">
      <h2 className="text-2xl font-bold">Learning Outcomes</h2>
      <div>
        <Label htmlFor="outcomes">What will students learn?</Label>
        <Textarea
          id="outcomes"
          value={courseData.outcomes}
          onChange={(e) => handleInputChange("outcomes", e.target.value)}
          placeholder="Describe what students will achieve after completing this course"
          rows={4}
        />
      </div>
    </div>,

    // Pricing Tab
    <div key="pricing" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Pricing</h2>
      <RadioGroup value={courseData.pricing} onValueChange={(value) => handleInputChange("pricing", value)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free">Free Course</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paid" id="paid" />
          <Label htmlFor="paid">Paid Course</Label>
        </div>
      </RadioGroup>
      {courseData.pricing === "paid" && (
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={courseData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="Enter price"
          />
        </div>
      )}
    </div>,

    // Media Tab
    <div key="media" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Media</h2>
      <div>
        <Label>Course overview provider</Label>
        <Select value={courseData.mediaProvider} onValueChange={(value) => handleInputChange("mediaProvider", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="mediaUrl">Course overview url</Label>
        <Input
          id="mediaUrl"
          value={courseData.mediaUrl}
          onChange={(e) => handleInputChange("mediaUrl", e.target.value)}
          placeholder="E.g: https://www.youtube.com/watch?v=aBtfYglw2w"
        />
      </div>
      <div>
        <Label htmlFor="thumbnail">Course thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange("thumbnail", e.target.files?.[0] || null)}
        />
        <div className="mt-2 w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
          600x400 (6:4)
        </div>
      </div>
    </div>,

    // SEO Tab
    <div key="seo" className="space-y-6">
      <h2 className="text-2xl font-bold">SEO Settings</h2>
      <div>
        <Label htmlFor="metaKeywords">Meta keywords</Label>
        <Input
          id="metaKeywords"
          value={courseData.metaKeywords}
          onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
          placeholder="Write a keyword and then press enter button"
        />
      </div>
      <div>
        <Label htmlFor="metaDescription">Meta description</Label>
        <Textarea
          id="metaDescription"
          value={courseData.metaDescription}
          onChange={(e) => handleInputChange("metaDescription", e.target.value)}
          placeholder="Enter meta description"
          rows={4}
        />
      </div>
    </div>,

    // Finish Tab
    <div key="finish" className="space-y-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
      <h2 className="text-2xl font-bold">Thank you !</h2>
      <p className="text-gray-600">You are just one click away</p>
      <Button className="bg-blue-600 hover:bg-blue-700">Submit</Button>
    </div>,
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course list
          </Button>
          <h1 className="text-3xl font-bold">Add new course</h1>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-6">COURSE ADDING FORM</h2>

          <MultiStepForm steps={courseTabs} onComplete={handleComplete}>
            {steps}
          </MultiStepForm>
        </div>
      </div>
    </AdminLayout>
  )
}
