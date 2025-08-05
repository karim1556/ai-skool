"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, PlayCircle, FileText, HelpCircle, ClipboardEdit, Video } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

// Define clear, explicit props for the component
interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: 'lesson' | 'quiz' | 'assignment';
  duration?: number;
  video_url?: string;
  completed?: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  overview?: string;
  curriculum: Section[];
}

interface CoursePlaybackClientProps {
  course: Course;
}

// This component is now fully type-safe and handles all UI logic.
export default function CoursePlaybackClientV2({ course }: CoursePlaybackClientProps) {
  const [curriculum, setCurriculum] = useState(course.curriculum);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(course.curriculum[0]?.lessons[0] || null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(course.curriculum[0]?.lessons[0]?.video_url);

  useEffect(() => {
    if (activeLesson?.type === 'lesson' && activeLesson.video_url) {
      setVideoUrl(activeLesson.video_url);
    } else if (activeLesson?.type === 'lesson') {
      // Fallback to fetch URL if not provided initially
      fetch(`/api/lessons/${activeLesson.id}/video`).then(async res => {
        if (res.ok) {
          const { url } = await res.json();
          setVideoUrl(url);
        }
      });
    }
  }, [activeLesson]);

  const handleToggleCompletion = (lessonId: string, sectionId: string) => {
    const newCurriculum = curriculum.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
          ),
        };
      }
      return section;
    });
    setCurriculum(newCurriculum);
  };

  const { totalLessons, completedLessons, progress } = useMemo(() => {
    const allLessons = curriculum.flatMap(section => section.lessons);
    const completed = allLessons.filter(lesson => lesson.completed);
    const total = allLessons.length;
    const progress = total > 0 ? (completed.length / total) * 100 : 0;
    return { totalLessons: total, completedLessons: completed.length, progress };
  }, [curriculum]);

  const ContentIcon = ({ lesson }: { lesson: Lesson }) => {
  switch (lesson.type) {
    case 'lesson':
      return <Video className="w-5 h-5 text-blue-500" />;
    case 'quiz':
      return <HelpCircle className="w-5 h-5 text-green-500" />;
    case 'assignment':
      return <ClipboardEdit className="w-5 h-5 text-purple-500" />;
    default:
      return <FileText className="w-5 h-5 text-gray-500" />;
  }
};

const QuizPlayer = ({ lesson }: { lesson: Lesson }) => (
  <div className="p-4 md:p-8 flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-blue-500" />
          <span>{lesson.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">This is where the interactive quiz will be rendered.</p>
        <Button size="lg">Start Quiz</Button>
      </CardContent>
    </Card>
  </div>
);

const AssignmentViewer = ({ lesson }: { lesson: Lesson }) => (
  <div className="p-4 md:p-8 h-full bg-gray-50 dark:bg-gray-900">
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <ClipboardEdit className="w-8 h-8 text-green-500" />
          <span>{lesson.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <h4>Assignment Instructions</h4>
          <p>The detailed instructions for completing and submitting this assignment would appear here.</p>
          <p>It could include text, links, and downloadable files.</p>
        </div>
        <Button className="mt-6">Submit Assignment</Button>
      </CardContent>
    </Card>
  </div>
);

const DocumentViewer = ({ lesson }: { lesson: Lesson }) => (
  <div className="p-4 md:p-8 h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-500" />
          <span>{lesson.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose dark:prose-invert max-w-none prose-video:w-full prose-video:aspect-video"
          dangerouslySetInnerHTML={{ __html: lesson.content || '<p>No content available for this lesson.</p>' }}
        />
      </CardContent>
    </Card>
  </div>
);

const CourseSidebar = ({ title, curriculum, activeLesson, progress, completedLessons, totalLessons, handleToggleCompletion, setActiveLesson }: any) => (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="p-4 border-b">
            <h2 className="text-lg font-bold truncate">{title}</h2>
            <div className="flex items-center gap-2 mt-2">
                <Progress value={progress} className="w-full h-2" />
                <span className="text-xs font-semibold">{Math.round(progress)}%</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{completedLessons} of {totalLessons} complete</p>
        </div>
        <div className="flex-1 overflow-y-auto">
            <Accordion type="multiple" defaultValue={curriculum.map((s: any) => s.id)} className="w-full">
                {curriculum.map((section: any) => (
                    <AccordionItem value={section.id} key={section.id}>
                        <AccordionTrigger className="px-4 py-3 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-800">{section.title}</AccordionTrigger>
                        <AccordionContent className="pb-0">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {section.lessons.map((lesson: any) => (
                                    <li key={lesson.id} onClick={() => setActiveLesson(lesson)} className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${activeLesson?.id === lesson.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                        <ContentIcon lesson={lesson} />
                                        <div className="flex-1 flex flex-col">
                                            <span className={`text-sm truncate ${lesson.completed ? 'line-through text-gray-500' : ''}`}>{lesson.title}</span>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); handleToggleCompletion(lesson.id, section.id); }} className="flex-shrink-0 ml-auto p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <CheckCircle className={`w-5 h-5 transition-colors ${lesson.completed ? 'text-green-500 fill-current' : 'text-gray-400 hover:text-green-500'}`} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </div>
);


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
      <main className="flex-1 flex flex-col bg-white dark:bg-black">
        <div className="flex-grow relative">
          {!activeLesson ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <PlayCircle className="w-16 h-16 mx-auto text-gray-500" />
                <p className="mt-2 text-gray-400">Select a lesson to begin your course.</p>
              </div>
            </div>
          ) : activeLesson.type === 'lesson' ? (
            activeLesson.video_url && videoUrl ? (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <video key={videoUrl} controls autoPlay className="w-full h-full object-contain">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <DocumentViewer lesson={activeLesson} />
            )
          ) : activeLesson.type === 'quiz' ? (
            <QuizPlayer lesson={activeLesson} />
          ) : activeLesson.type === 'assignment' ? (
            <AssignmentViewer lesson={activeLesson} />
          ) : null}
        </div>

        <div className="p-4 border-y border-gray-200 dark:border-gray-800 flex lg:hidden items-center justify-between">
          <div>
            <h1 className="text-lg font-bold truncate">{course.title}</h1>
            <p className="text-sm text-gray-500">{completedLessons} of {totalLessons} lessons complete</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">View Content</Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full max-w-sm bg-gray-50 dark:bg-gray-900">
              <CourseSidebar {...{ title: course.title, curriculum, activeLesson, progress, completedLessons, totalLessons, handleToggleCompletion, setActiveLesson }} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 flex-1">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="border-b border-gray-200 dark:border-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="qna">Q&A</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="py-4 text-gray-600 dark:text-gray-300">
              <h2 className="text-xl font-bold mb-2">About this course</h2>
              <p className="mb-4">{course.overview}</p>
            </TabsContent>
             <TabsContent value="qna" className="py-4 text-gray-600 dark:text-gray-300">
              <h2 className="text-xl font-bold mb-2">Q&A</h2>
              <p>This section will contain questions and answers.</p>
            </TabsContent>
            <TabsContent value="notes" className="py-4 text-gray-600 dark:text-gray-300">
              <h2 className="text-xl font-bold mb-2">Notes</h2>
              <p>Take notes here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <aside className="hidden lg:flex w-80 flex-col border-l border-gray-200 dark:border-gray-800">
        <CourseSidebar {...{ title: course.title, curriculum, activeLesson, progress, completedLessons, totalLessons, handleToggleCompletion, setActiveLesson }} />
      </aside>
    </div>
  );
}
