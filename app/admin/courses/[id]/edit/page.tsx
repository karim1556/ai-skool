"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { courseTabs } from "@/lib/course-tabs"
import { AddSectionModal } from "@/components/courses/add-section-modal"
import { AddLessonModal } from "@/components/courses/add-lesson-modal"
import { AddQuizModal } from "@/components/courses/add-quiz-modal"
import { AddAssignmentModal } from "@/components/courses/add-assignment-modal"
import { SortSectionsModal } from "@/components/courses/sort-sections-modal"
import { ArrowLeft, Plus, ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("curriculum")

  // Modal states
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [showAddQuiz, setShowAddQuiz] = useState(false)
  const [showAddAssignment, setShowAddAssignment] = useState(false)
  const [showSortSections, setShowSortSections] = useState(false)

  // Course data state
  const [sections, setSections] = useState([
    "Getting Started With Mtiny",
    "Learning The Coding Tools",
    "Exploring Mtiny Features",
  ])

  const [lessons, setLessons] = useState([
    { id: 1, title: "Introduction Of Robot", section: "Getting Started With Mtiny", type: "document" },
    { id: 2, title: "Introduction Video", section: "Getting Started With Mtiny", type: "video" },
    { id: 3, title: "Map Blocks", section: "Getting Started With Mtiny", type: "document" },
    { id: 4, title: "Map Blocks Video", section: "Getting Started With Mtiny", type: "video" },
  ])

  const [quizzes, setQuizzes] = useState([
    { id: 1, title: "test1", section: "Getting Started With Mtiny" },
    { id: 2, title: "Section 1 Quiz", section: "Getting Started With Mtiny" },
  ])

  const [assignments, setAssignments] = useState([])

  // Handlers
  const handleAddSection = (title: string) => {
    setSections([...sections, title])
  }

  const handleAddLesson = (lessonData: any) => {
    setLessons([...lessons, lessonData])
  }

  const handleAddQuiz = (quizData: any) => {
    setQuizzes([...quizzes, quizData])
  }

  const handleAddAssignment = (assignmentData: any) => {
    setAssignments([...assignments, assignmentData])
  }

  const handleSortSections = (sortedSections: string[]) => {
    setSections(sortedSections)
  }

  const renderCurriculumTab = () => (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => setShowAddSection(true)}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add section
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowAddLesson(true)}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add lesson
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowAddQuiz(true)}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add quiz
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowAddAssignment(true)}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add assignment
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowSortSections(true)}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort sections
        </Button>
      </div>

      {/* Course Content */}
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Section {sectionIndex + 1}: {section}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  Sort lesson
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit section
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete section
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {/* Quizzes for this section */}
              {quizzes
                .filter((quiz) => quiz.section === section)
                .map((quiz) => (
                  <div
                    key={`quiz-${quiz.id}`}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">🧩</span>
                      <span>
                        Quiz {quiz.id} : {quiz.title}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              {/* Lessons for this section */}
              {lessons
                .filter((lesson) => lesson.section === section)
                .map((lesson) => (
                  <div
                    key={`lesson-${lesson.id}`}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">{lesson.type === "video" ? "📹" : "📄"}</span>
                      <span>
                        Lesson {lesson.id} : {lesson.title}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              {/* Assignments for this section */}
              {assignments
                .filter((assignment: any) => assignment.section === section)
                .map((assignment: any) => (
                  <div
                    key={`assignment-${assignment.id}`}
                    className="flex items-center justify-between p-3 bg-white rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">📝</span>
                      <span>Assignment : {assignment.title}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "curriculum":
        return renderCurriculumTab()
      case "basic":
        return <div className="p-8 text-center text-gray-500">Basic course information form would go here</div>
      case "requirements":
        return <div className="p-8 text-center text-gray-500">Course requirements form would go here</div>
      case "outcomes":
        return <div className="p-8 text-center text-gray-500">Learning outcomes form would go here</div>
      case "pricing":
        return <div className="p-8 text-center text-gray-500">Pricing settings would go here</div>
      case "media":
        return <div className="p-8 text-center text-gray-500">Media upload form would go here</div>
      case "seo":
        return <div className="p-8 text-center text-gray-500">SEO settings would go here</div>
      case "finish":
        return <div className="p-8 text-center text-gray-500">Course completion settings would go here</div>
      default:
        return renderCurriculumTab()
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course list
            </Button>
            <h1 className="text-2xl font-bold">Update: A-Tiny</h1>
          </div>
          <Button variant="outline">View on frontend →</Button>
        </div>

        {/* Course Manager */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">COURSE MANAGER</h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {courseTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 border-b-2 transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-transparent hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Modals */}
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
