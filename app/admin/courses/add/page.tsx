"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function AddCoursePage() {
  const router = useRouter()
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    language: "",
    provider: "",
    duration: "",
    price: 0,
    original_price: 0,
    lessons: 0,
    reviews: 0,
    rating: 0,
    students: 0,
    is_free: true,
    requirements: "",
    meta_keywords: "",
    meta_description: "",
    image: null as File | null,
  })

  const handleInputChange = (field: string, value: any) => {
    setCourseData({ ...courseData, [field]: value })
  }

  const handleComplete = async () => {
    const formData = new FormData();
    Object.entries(courseData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, value.join(','));
      } else if (value instanceof File) {
        // Do not append if it's a file but not the image key (or handle as needed)
      } else {
        formData.append(key, String(value));
      }
    });

    const res = await fetch('/api/courses', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/admin/courses');
    } else {
      const errorData = await res.json();
      console.error('Error creating course:', errorData.details || 'Unknown error');
    }
  };

  const steps = [
    <div key="basic" className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Information</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Course Title *</Label>
          <Input id="title" value={courseData.title} onChange={(e) => handleInputChange("title", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="provider">Provider</Label>
          <Input
            id="provider"
            value={courseData.provider}
            onChange={(e) => handleInputChange("provider", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Course Description *</Label>
        <Textarea
          id="description"
          value={courseData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
    </div>,
    <div key="details" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Details</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={courseData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="level">Level</Label>
          <Select value={courseData.level} onValueChange={(value) => handleInputChange("level", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={courseData.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={courseData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lessons">Total Lessons</Label>
          <Input
            id="lessons"
            type="number"
            value={courseData.lessons}
            onChange={(e) => handleInputChange("lessons", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="students">Number of Students</Label>
          <Input
            id="students"
            type="number"
            value={courseData.students}
            onChange={(e) => handleInputChange("students", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="reviews">Number of Reviews</Label>
          <Input
            id="reviews"
            type="number"
            value={courseData.reviews}
            onChange={(e) => handleInputChange("reviews", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={courseData.rating}
            onChange={(e) => handleInputChange("rating", Number(e.target.value))}
          />
        </div>
      </div>
    </div>,

    <div key="requirements" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Requirements & Outcomes</h2>
      <div>
        <Label htmlFor="requirements">Course Requirements</Label>
        <Textarea
          id="requirements"
          value={courseData.requirements}
          onChange={(e) => handleInputChange("requirements", e.target.value)}
          placeholder="What prerequisites are needed for this course?"
        />
      </div>
    </div>,

    <div key="pricing" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Pricing</h2>
      <RadioGroup
        value={courseData.is_free ? "free" : "paid"}
        onValueChange={(value) => handleInputChange("is_free", value === "free")}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="free" id="free" />
          <Label htmlFor="free">Free Course</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paid" id="paid" />
          <Label htmlFor="paid">Paid Course</Label>
        </div>
      </RadioGroup>
      {!courseData.is_free && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={courseData.price}
              onChange={(e) => handleInputChange("price", Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="original_price">Original Price</Label>
            <Input
              id="original_price"
              type="number"
              value={courseData.original_price}
              onChange={(e) => handleInputChange("original_price", Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>,

    <div key="media" className="space-y-6">
      <h2 className="text-2xl font-bold">Course Media</h2>
      <div>
        <Label htmlFor="thumbnail">Course thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange("image", e.target.files?.[0] || null)}
        />
        {courseData.image && (
          <img 
            src={URL.createObjectURL(courseData.image)} 
            alt="Course thumbnail preview" 
            className="mt-4 w-48 h-auto" 
          />
        )}
      </div>
    </div>,

    <div key="seo" className="space-y-6">
      <h2 className="text-2xl font-bold">SEO & Marketing</h2>
      <div>
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          value={courseData.meta_description}
          onChange={(e) => handleInputChange("meta_description", e.target.value)}
          placeholder="Brief description for search engines (150-160 characters)"
        />
      </div>
      <div>
        <Label htmlFor="meta_keywords">Meta Keywords</Label>
        <Input
          id="meta_keywords"
          value={courseData.meta_keywords}
          onChange={(e) => handleInputChange("meta_keywords", e.target.value)}
          placeholder="Comma-separated keywords for SEO"
        />
      </div>
    </div>,

    <div key="finish" className="space-y-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
      <h2 className="text-2xl font-bold">Thank you !</h2>
      <p className="text-gray-600">You are just one click away</p>
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
          <MultiStepForm steps={courseTabs.map(t => ({id: t.id, title: t.label, icon: t.icon}))} onComplete={handleComplete}>
            {steps}
          </MultiStepForm>
        </div>
      </div>
    </AdminLayout>
  )
}
