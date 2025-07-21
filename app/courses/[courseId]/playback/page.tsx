"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlayCircle, CheckCircle } from "lucide-react"
import { useState, useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Mock course data for playback
const mockCoursePlayback = {
  id: 1,
  title: "PHP Tutorial Beginner to Advanced",
  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Example video URL
  videoPoster: "/placeholder.svg?height=400&width=700&text=PHP Tutorial Video",
  overview: `Learn everything you need to start a successful career as a PHP developer. This course covers PHP fundamentals, advanced topics, database integration, and building real-world applications.`,
  lastUpdated: "Last updated July 2024",
  rating: 4.5,
  students: "53,884 Students",
  duration: "11 hours Total",
  language: "English",
  subtitles: "English [Auto]",
  curriculum: [
    {
      section: 1,
      title: "Introduction",
      lessons: [{ id: "1-1", title: "Introduction", duration: "2min", completed: true }],
    },
    {
      section: 2,
      title: "Introduction to PHP and how to build your first web application",
      lessons: [
        { id: "2-1", title: "Lesson 2.1", duration: "8min", completed: true },
        { id: "2-2", title: "Lesson 2.2", duration: "10min", completed: true },
        { id: "2-3", title: "Lesson 2.3", duration: "12min", completed: true },
        { id: "2-4", title: "Lesson 2.4", duration: "15min", completed: true },
        { id: "2-5", title: "Lesson 2.5", duration: "14min", completed: true },
        { id: "2-6", title: "Lesson 2.6", duration: "10min", completed: true },
        { id: "2-7", title: "Lesson 2.7", duration: "10min", completed: true },
        { id: "2-8", title: "Lesson 2.8", duration: "10min", completed: false },
      ],
    },
    {
      section: 3,
      title: "Project 1",
      lessons: [{ id: "3-1", title: "Project 1 Overview", duration: "7min", completed: true }],
    },
    {
      section: 4,
      title: "Learn",
      lessons: [
        { id: "4-1", title: "Lesson 4.1", duration: "20min", completed: true },
        { id: "4-2", title: "Lesson 4.2", duration: "15min", completed: true },
        { id: "4-3", title: "Lesson 4.3", duration: "10min", completed: true },
      ],
    },
    {
      section: 5,
      title: "Project 2",
      lessons: [{ id: "5-1", title: "Project 2 Overview", duration: "11min", completed: true }],
    },
    {
      section: 6,
      title: "Learn",
      lessons: [{ id: "6-1", title: "Lesson 6.1", duration: "37min", completed: true }],
    },
    {
      section: 7,
      title: "Project 3",
      lessons: [{ id: "7-1", title: "Project 3 Overview", duration: "11min", completed: true }],
    },
    {
      section: 8,
      title: "Learn",
      lessons: [{ id: "8-1", title: "Lesson 8.1", duration: "7min", completed: true }],
    },
    {
      section: 9,
      title: "Project",
      lessons: [{ id: "9-1", title: "Project 9 Overview", duration: "19min", completed: true }],
    },
    {
      section: 10,
      title: "Learn",
      lessons: [{ id: "10-1", title: "Lesson 10.1", duration: "14min", completed: true }],
    },
    {
      section: 11,
      title: "Project",
      lessons: [{ id: "11-1", title: "Project 11 Overview", duration: "11min", completed: true }],
    },
    {
      section: 12,
      title: "Learn",
      lessons: [{ id: "12-1", title: "Lesson 12.1", duration: "10min", completed: true }],
    },
  ],
}

interface CourseSidebarProps {
  title: string
  curriculum: any[]
  activeLesson: string
  progress: number
  completedLessons: number
  totalLessons: number
  handleToggleCompletion: (lessonId: string) => void
  setActiveLesson: (lessonId: string) => void
}

const CourseSidebar = ({
  title,
  curriculum,
  activeLesson,
  progress,
  completedLessons,
  totalLessons,
  handleToggleCompletion,
  setActiveLesson,
}: CourseSidebarProps) => (
  <div className="flex flex-col h-full bg-white">
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
      <div className="flex items-center gap-2">
        <Progress value={progress} className="w-full" />
        <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {completedLessons} / {totalLessons} lessons completed
      </p>
    </div>
    <div className="flex-1 p-4 overflow-y-auto">
      <Accordion type="multiple" className="w-full" defaultValue={["section-1"]}>
        {curriculum.map((section) => (
          <AccordionItem key={section.section} value={`section-${section.section}`}>
            <AccordionTrigger className="text-base font-semibold text-gray-800 hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <span>
                  Section {section.section}: {section.title}
                </span>
                <span className="text-xs font-normal text-gray-500 mt-1">
                  {section.lessons.filter((l: any) => l.completed).length}/{section.lessons.length} |{" "}
                  {section.lessons.reduce((acc: number, l: any) => acc + Number.parseInt(l.duration), 0)}min
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <ul className="space-y-2">
                {section.lessons.map((lesson: any) => (
                  <li
                    key={lesson.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      activeLesson === lesson.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleToggleCompletion(lesson.id)} className="focus:outline-none">
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <PlayCircle className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      <span className="text-sm flex-1" onClick={() => setActiveLesson(lesson.id)}>
                        {lesson.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
)

export default function CoursePlaybackPage() {
  const [curriculum, setCurriculum] = useState(mockCoursePlayback.curriculum)
  const [activeLesson, setActiveLesson] = useState(curriculum[0]?.lessons[0]?.id || "")

  const handleToggleCompletion = (lessonId: string) => {
    const newCurriculum = curriculum.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
      ),
    }))
    setCurriculum(newCurriculum)
  }

  const { totalLessons, completedLessons, progress } = useMemo(() => {
    const total = curriculum.reduce((acc, section) => acc + section.lessons.length, 0)
    const completed = curriculum.reduce(
      (acc, section) => acc + section.lessons.filter((l) => l.completed).length,
      0
    )
    const percentage = total > 0 ? (completed / total) * 100 : 0
    return { totalLessons: total, completedLessons: completed, progress: percentage }
  }, [curriculum])

  return (
    <div className="lg:flex min-h-screen bg-gray-100">
      <main className="flex-1 flex flex-col bg-gray-900 text-white">
        <div className="relative w-full h-0 pb-[56.25%] bg-black">
          <video
            key={activeLesson}
            controls
            autoPlay
            poster={mockCoursePlayback.videoPoster}
            className="absolute inset-0 w-full h-full object-contain"
          >
            <source src={mockCoursePlayback.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="p-4 border-y border-gray-800 flex lg:hidden items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{mockCoursePlayback.title}</h1>
            <p className="text-sm text-gray-400">
              {completedLessons} of {totalLessons} lessons complete
            </p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">View Content</Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full max-w-sm">
              <CourseSidebar
                title={mockCoursePlayback.title}
                curriculum={curriculum}
                activeLesson={activeLesson}
                progress={progress}
                completedLessons={completedLessons}
                totalLessons={totalLessons}
                handleToggleCompletion={handleToggleCompletion}
                setActiveLesson={setActiveLesson}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="bg-gray-900 p-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-700 rounded-none h-auto p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-t-md rounded-b-none px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="qna"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-t-md rounded-b-none px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Q&A
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-t-md rounded-b-none px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="py-4 text-gray-300">
              <h2 className="text-xl font-bold mb-2">About this course</h2>
              <p className="mb-4">{mockCoursePlayback.overview}</p>
            </TabsContent>
            <TabsContent value="qna" className="py-4 text-gray-300">
              <h2 className="text-xl font-bold mb-2">Q&A</h2>
              <p>This section will contain questions and answers.</p>
            </TabsContent>
            <TabsContent value="notes" className="py-4 text-gray-300">
              <h2 className="text-xl font-bold mb-2">Notes</h2>
              <p>Take notes here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <aside className="hidden lg:flex w-80 flex-col border-l border-gray-200">
        <CourseSidebar
          title={mockCoursePlayback.title}
          curriculum={curriculum}
          activeLesson={activeLesson}
          progress={progress}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          handleToggleCompletion={handleToggleCompletion}
          setActiveLesson={setActiveLesson}
        />
      </aside>
    </div>
  )
} 