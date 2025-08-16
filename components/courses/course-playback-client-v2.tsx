"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, PlayCircle, FileText, HelpCircle, ClipboardEdit, Video, CheckSquare } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define clear, explicit props for the component
type LessonType = 'lesson' | 'quiz' | 'assignment' | 'video' | 'document' | 'video_file';

interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: LessonType;
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
  const router = useRouter();
  const [curriculum, setCurriculum] = useState(course.curriculum);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(course.curriculum[0]?.lessons[0] || null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(course.curriculum[0]?.lessons[0]?.video_url);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeLesson?.type === 'lesson') {
      setVideoUrl(activeLesson.video_url);
    }
  }, [activeLesson]);

  const handleSelectLesson = (lesson: Lesson) => {
    setIsLoading(true);
    setActiveLesson(lesson);
    // Simulate network latency for loader visibility
    setTimeout(() => setIsLoading(false), 300);
  };

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
      case 'video':
      case 'video_file':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'quiz':
        return <HelpCircle className="w-5 h-5 text-green-500" />;
      case 'assignment':
        return <ClipboardEdit className="w-5 h-5 text-purple-500" />;
      case 'lesson': // Fallback for general lessons
        if (lesson.video_url && lesson.video_url.endsWith('.pdf')) {
          return <FileText className="w-5 h-5 text-orange-500" />;
        }
        if (lesson.video_url) {
          return <PlayCircle className="w-5 h-5 text-blue-500" />;
        }
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

const QuizPlayer = ({ lesson }: { lesson: Lesson }) => {
  const router = useRouter();
  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 dark:bg-blue-900 rounded-full p-4 w-max">
            <HelpCircle className="w-12 h-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold mt-4">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center px-6 pb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-6">You are about to start the quiz. Review your notes and get ready to test your knowledge!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105" onClick={() => router.push(`/quizzes/${lesson.id}`)}>
                Start Quiz
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AssignmentViewer = ({ lesson }: { lesson: Lesson }) => {
  // The signed URL for the PDF is passed in video_url by the server
  const documentUrl = lesson.video_url;

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
      
      {/* Instructions are in the 'content' field for assignments, which is mapped from 'instructions' on the server */}
      {lesson.content && (
        <div
          className="prose dark:prose-invert max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {documentUrl ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Attached Document</h3>
          <div className="w-full h-[600px] border rounded-md">
            <object
              data={documentUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className="rounded-md shadow-lg"
            >
              <div className="p-4 text-center">
                <p className="mb-4 text-red-500">
                  It appears you don't have a PDF plugin for this browser. You can{' '}
                  <a href={documentUrl} className="text-blue-500 hover:underline">
                    click here to download the PDF file.
                  </a>
                </p>
              </div>
            </object>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">No document attached to this assignment.</p>
        </div>
      )}
    </div>
  );
};

const DocumentViewer = ({ lesson }: { lesson: Lesson }) => {
  useEffect(() => {
    console.log('DocumentViewer mounted with lesson:', {
      id: lesson.id,
      title: lesson.title,
      type: lesson.type, 
      video_url: lesson.video_url || 'No URL',
      content_length: lesson.content?.length || 0
    });
  }, [lesson]);

  const fileUrl = (lesson as any).file_url || lesson.video_url || '';
  
  // Check if this is a video
  const isVideo = fileUrl && 
                 typeof fileUrl === 'string' && 
                 (fileUrl.endsWith('.mp4') || 
                  fileUrl.includes('video') ||
                  (lesson as any).type === 'video_file');

  // Check if this is a PDF document
  const isPdf = fileUrl && 
               typeof fileUrl === 'string' && 
               (fileUrl.endsWith('.pdf') || 
                (lesson as any).type === 'document' ||
                lesson.type === 'assignment');

  if (isVideo && fileUrl) {
    console.log('Rendering video player with URL:', fileUrl);
    
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <video 
          key={fileUrl} 
          controls 
          autoPlay 
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error('Video error:', e);
            console.error('Video error details:', {
              networkState: e.currentTarget.networkState,
              error: e.currentTarget.error,
              readyState: e.currentTarget.readyState,
              src: e.currentTarget.src
            });
          }}
          onLoadedMetadata={(e) => {
            console.log('Video metadata loaded:', {
              duration: e.currentTarget.duration,
              videoWidth: e.currentTarget.videoWidth,
              videoHeight: e.currentTarget.videoHeight,
              readyState: e.currentTarget.readyState
            });
          }}
          onLoadStart={() => console.log('Video load started')}
          onLoadedData={() => console.log('Video data loaded')}
          onCanPlay={() => console.log('Video can play')}
          onPlaying={() => console.log('Video started playing')}
        >
          <source 
            src={fileUrl} 
            type="video/mp4" 
            onError={(e) => console.error('Source error:', e)}
          />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  
  // Handle PDF documents
  if (isPdf && fileUrl) {
    console.log('Rendering PDF viewer with URL:', fileUrl);
    
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1">
          <object 
            data={fileUrl} 
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="p-4">
              <p className="mb-4">Unable to display PDF. Please download it to view.</p>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download PDF
              </a>
            </div>
          </object>
        </div>
      </div>
    );
  }

  // If there's HTML content, render it
  if (lesson.content) {
    return (
      <div className="p-4 md:p-8 h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              {lesson.type === 'quiz' ? (
                <CheckSquare className="w-5 h-5 text-gray-500" />
              ) : lesson.type === 'assignment' || (lesson.video_url && lesson.video_url.endsWith('.pdf')) ? (
                <FileText className="w-5 h-5 text-gray-500" />
              ) : (
                <PlayCircle className="w-5 h-5 text-gray-500" />
              )}
              <span>{lesson.title}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose dark:prose-invert max-w-none prose-video:w-full prose-video:aspect-video"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback if no content is available
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <FileText className="w-16 h-16 mx-auto text-gray-400" />
        <p className="mt-2 text-gray-500">No content available for this lesson.</p>
      </div>
    </div>
  );
};

const CourseSidebar = ({ title, curriculum, activeLesson, progress, completedLessons, totalLessons, handleToggleCompletion, handleSelectLesson }: any) => (
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
                                    <li key={lesson.id} onClick={() => handleSelectLesson(lesson)} className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${activeLesson?.id === lesson.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
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
      <main className="flex-1 flex flex-col bg-white dark:bg-black relative">
        <div className="flex-grow relative overflow-y-auto">
          {isLoading && (
            <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10">
              <Loader size="lg" />
            </div>
          )}
          {!activeLesson ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <PlayCircle className="w-16 h-16 mx-auto text-gray-500" />
                <p className="mt-2 text-gray-400">Select a lesson to begin your course.</p>
              </div>
            </div>
          ) : activeLesson.type === 'quiz' ? (
            <QuizPlayer lesson={activeLesson} />
          ) : activeLesson.type === 'assignment' ? (
            <AssignmentViewer lesson={activeLesson} />
          ) : (
            <DocumentViewer lesson={activeLesson} />
          )}
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
              <CourseSidebar {...{ title: course.title, curriculum, activeLesson, progress, completedLessons, totalLessons, handleToggleCompletion, handleSelectLesson }} />
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
        <CourseSidebar {...{ title: course.title, curriculum, activeLesson, progress, completedLessons, totalLessons, handleToggleCompletion, handleSelectLesson }} />
      </aside>
    </div>
  );
}
