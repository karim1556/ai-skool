"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { MultiStepForm } from "@/components/forms/multi-step-form"
import { courseTabs } from "@/lib/course-tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CheckCircle, Plus, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { AddSectionModal } from "@/components/courses/add-section-modal"
import { AddLessonModal } from "@/components/courses/add-lesson-modal"
import { AddQuizModal } from "@/components/courses/add-quiz-modal"
import { AddAssignmentModal } from "@/components/courses/add-assignment-modal"
import { SortSectionsModal } from "@/components/courses/sort-sections-modal"

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [courseData, setCourseData] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [lessons, setLessons] = useState<any>({})
  const [quizzes, setQuizzes] = useState<any>({})
  const [assignments, setAssignments] = useState<any>({})

  // Modal states
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [showAddQuiz, setShowAddQuiz] = useState(false)
  const [showAddAssignment, setShowAddAssignment] = useState(false)
  const [showSortSections, setShowSortSections] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      if (id) {
        try {
          const res = await fetch(`/api/courses/${id}`)
          if (res.ok) {
            const data = await res.json()
            // Ensure all string fields are not null
            const cleanData = {
              ...data,
              title: data.title || '',
              description: data.description || '',
              provider: data.provider || '',
              category: data.category || '',
              level: data.level || '',
              language: data.language || '',
              duration: data.duration || '',
              requirements: data.requirements || '',
              meta_keywords: data.meta_keywords || '',
              meta_description: data.meta_description || '',
              image: data.image || '',
              price: data.price || 0,
              original_price: data.original_price || 0,
              lessons: data.lessons || 0,
              rating: data.rating || 0,
              reviews: data.reviews || 0,
              students: data.students || 0,
              is_free: data.is_free || false
            }
            setCourseData(cleanData)
          }
        } catch (error) {
          console.error('Error fetching course:', error)
        }
      }
    }
    const fetchSections = async () => {
      if (id) {
        try {
          const res = await fetch(`/api/courses/${id}/sections`)
          if (res.ok) {
            const data = await res.json()
            setSections(data || [])
          }
        } catch (error) {
          console.error('Error fetching sections:', error)
          setSections([])
        }
      }
    }
    fetchCourse()
    fetchSections()
  }, [id])

  useEffect(() => {
    const fetchContent = async () => {
      const newLessons: any = {}
      const newQuizzes: any = {}
      const newAssignments: any = {}
      for (const section of sections) {
        try {
          const [lessonsRes, quizzesRes, assignmentsRes] = await Promise.all([
            fetch(`/api/sections/${section.id}/lessons`),
            fetch(`/api/sections/${section.id}/quizzes`),
            fetch(`/api/sections/${section.id}/assignments`),
          ])
          newLessons[section.id] = lessonsRes.ok ? await lessonsRes.json() : []
          newQuizzes[section.id] = quizzesRes.ok ? await quizzesRes.json() : []
          newAssignments[section.id] = assignmentsRes.ok ? await assignmentsRes.json() : []
        } catch (error) {
          console.error(`Error fetching content for section ${section.id}:`, error)
          newLessons[section.id] = []
          newQuizzes[section.id] = []
          newAssignments[section.id] = []
        }
      }
      setLessons(newLessons)
      setQuizzes(newQuizzes)
      setAssignments(newAssignments)
    }
    if (sections.length > 0) {
      fetchContent()
    }
  }, [sections])

  const handleInputChange = (field: string, value: any) => {
    setCourseData({ ...courseData, [field]: value })
  }

  const handleComplete = async () => {
    if (!courseData) return

    try {
      const formData = new FormData()
      Object.entries(courseData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key === 'image') {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'string') {
            // Keep existing image path if no new file is selected
            formData.append(key, value);
          }
        } else if (Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (res.ok) {
        router.push("/admin/courses")
      } else {
        const errorText = await res.text()
        console.error("Error updating course:", res.status, errorText)
      }
    } catch (error) {
      console.error("Error in handleComplete:", error)
    }
  }

  const handleAddSection = async (title: string) => {
    const res = await fetch(`/api/courses/${id}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    const newSection = await res.json()
    setSections([...sections, newSection])
  }

  const handleAddLesson = async (lessonData: any) => {
    const res = await fetch(`/api/sections/${lessonData.section_id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lessonData),
    })
    const newLesson = await res.json()
    setLessons((prev: any) => ({
      ...prev,
      [lessonData.section_id]: [...(prev[lessonData.section_id] || []), newLesson],
    }))
  }

  const handleAddQuiz = async (quizData: any) => {
    const res = await fetch(`/api/sections/${quizData.section_id}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    })
    const newQuiz = await res.json()
    setQuizzes((prev: any) => ({
      ...prev,
      [quizData.section_id]: [...(prev[quizData.section_id] || []), newQuiz],
    }))
  }

  const handleAddAssignment = async (assignmentData: any) => {
    const res = await fetch(`/api/sections/${assignmentData.section_id}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignmentData),
    })
    const newAssignment = await res.json()
    setAssignments((prev: any) => ({
      ...prev,
      [assignmentData.section_id]: [...(prev[assignmentData.section_id] || []), newAssignment],
    }))
  }

  const handleSortSections = async (sortedSections: any[]) => {
    setSections(sortedSections)
    await fetch(`/api/courses/${id}/sections/sort`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: sortedSections }),
    })
  }

  if (!courseData) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    )
  }

  const steps = [
    <div key="curriculum" className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setShowAddSection(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add section
        </Button>
        <Button variant="outline" onClick={() => setShowAddLesson(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add lesson
        </Button>
        <Button variant="outline" onClick={() => setShowAddQuiz(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add quiz
        </Button>
        <Button variant="outline" onClick={() => setShowAddAssignment(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add assignment
        </Button>
        <Button variant="outline" onClick={() => setShowSortSections(true)}>
          <ArrowUpDown className="h-4 w-4 mr-2" /> Sort sections
        </Button>
      </div>
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <div key={section.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Section {sectionIndex + 1}: {section.title}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {quizzes[section.id]?.map((quiz: any) => (
                <div key={`quiz-${quiz.id}`} className="flex items-center justify-between p-3 bg-white rounded border">
                  <span>Quiz: {quiz.title}</span>
                </div>
              ))}
              {lessons[section.id]?.map((lesson: any) => (
                <div
                  key={`lesson-${lesson.id}`}
                  className="flex items-center justify-between p-3 bg-white rounded border"
                >
                  <span>Lesson: {lesson.title}</span>
                </div>
              ))}
              {assignments[section.id]?.map((assignment: any) => (
                <div
                  key={`assignment-${assignment.id}`}
                  className="flex items-center justify-between p-3 bg-white rounded border"
                >
                  <span>Assignment: {assignment.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>,
    <div key="basic" className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Information</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Course Title *</Label>
          <Input id="title" value={courseData.title || ''} onChange={(e) => handleInputChange("title", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="provider">Provider</Label>
          <Input
            id="provider"
            value={courseData.provider || ''}
            onChange={(e) => handleInputChange("provider", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Course Description *</Label>
        <Textarea
          id="description"
          value={courseData.description || ''}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={courseData.category || ''}
            onChange={(e) => handleInputChange("category", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={courseData.language || 'English'} onValueChange={(value) => handleInputChange("language", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="level">Level</Label>
          <Select value={courseData.level || 'Beginner'} onValueChange={(value) => handleInputChange("level", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={courseData.duration || ''}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            placeholder="e.g., 10 hours"
          />
        </div>
        <div>
          <Label htmlFor="duration_hours">Duration (Hours)</Label>
          <Input
            id="duration_hours"
            type="number"
            value={courseData.duration_hours || 0}
            onChange={(e) => handleInputChange("duration_hours", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label htmlFor="lessons">Total Lessons</Label>
          <Input
            id="lessons"
            type="number"
            value={courseData.lessons || 0}
            onChange={(e) => handleInputChange("lessons", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="students">Number of Students</Label>
          <Input
            id="students"
            type="number"
            value={courseData.students || 0}
            onChange={(e) => handleInputChange("students", Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="reviews">Number of Reviews</Label>
          <Input
            id="reviews"
            type="number"
            value={courseData.reviews || 0}
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
            value={courseData.rating || 0}
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
          value={courseData.requirements || ''}
          onChange={(e) => handleInputChange("requirements", e.target.value)}
          placeholder="What prerequisites are needed for this course?"
        />
      </div>
      <div>
        <Label htmlFor="objectives">Course Objectives</Label>
        <Textarea
          id="objectives"
          value={Array.isArray(courseData.objectives) ? courseData.objectives.join('\n') : (courseData.objectives || '')}
          onChange={(e) => handleInputChange("objectives", e.target.value.split('\n').filter(line => line.trim()))}
          placeholder="List the main objectives of this course (one per line)"
        />
      </div>
      <div>
        <Label htmlFor="outcomes">Learning Outcomes</Label>
        <Textarea
          id="outcomes"
          value={Array.isArray(courseData.outcomes) ? courseData.outcomes.join('\n') : (courseData.outcomes || '')}
          onChange={(e) => handleInputChange("outcomes", e.target.value.split('\n').filter(line => line.trim()))}
          placeholder="What will students learn? (one per line)"
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
              value={courseData.price || 0}
              onChange={(e) => handleInputChange("price", Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="original_price">Original Price</Label>
            <Input
              id="original_price"
              type="number"
              value={courseData.original_price || 0}
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
            src={typeof courseData.image === 'string' ? courseData.image : URL.createObjectURL(courseData.image)} 
            alt="Course thumbnail" 
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
          value={courseData.meta_description || ''}
          onChange={(e) => handleInputChange("meta_description", e.target.value)}
          placeholder="Brief description for search engines (150-160 characters)"
        />
      </div>
      <div>
        <Label htmlFor="meta_keywords">Meta Keywords</Label>
        <Input
          id="meta_keywords"
          value={courseData.meta_keywords || ''}
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
          <h1 className="text-3xl font-bold">Edit course</h1>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <MultiStepForm steps={courseTabs.map(t => ({id: t.id, title: t.label, icon: t.icon}))} onComplete={handleComplete}>
            {steps}
          </MultiStepForm>
        </div>
      </div>
      <AddSectionModal isOpen={showAddSection} onClose={() => setShowAddSection(false)} onAdd={handleAddSection} />
      <AddLessonModal
        isOpen={showAddLesson}
        onClose={() => setShowAddLesson(false)}
        onAdd={handleAddLesson}
        sections={sections}
      />
      <AddQuizModal
        isOpen={showAddQuiz}
        onClose={() => setShowAddQuiz(false)}
        onAdd={handleAddQuiz}
        sections={sections}
      />
      <AddAssignmentModal
        isOpen={showAddAssignment}
        onClose={() => setShowAddAssignment(false)}
        onAdd={handleAddAssignment}
        sections={sections}
      />
      <SortSectionsModal
        isOpen={showSortSections}
        onClose={() => setShowSortSections(false)}
        sections={sections}
        onUpdateSorting={handleSortSections}
      />
    </AdminLayout>
  )
}
