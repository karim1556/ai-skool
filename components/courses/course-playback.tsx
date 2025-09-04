'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlayCircle, FileText, CheckSquare } from 'lucide-react';

// Define the types for the data we receive as props
interface Lesson {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  content?: string;
  video_url?: string;
}

interface Section {
  id: string;
  title: string;
  lessons?: Lesson[];
}

interface CoursePlaybackProps {
  course: {
    id: string;
    title: string;
    curriculum?: Section[];
  };
}

export default function CoursePlayback({ course }: CoursePlaybackProps) {
  const [selectedContent, setSelectedContent] = useState<Lesson | null>(course.curriculum?.[0]?.lessons?.[0] || null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const router = useRouter();

  const handleSelectContent = async (content: Lesson) => {
    console.log('Selected content:', content);
    setSelectedContent(content);
    if (content.type === 'lesson') {
      setIsLoadingContent(true);
      try {
        const response = await fetch(`/api/lessons/${content.id}`);
        if (response.ok) {
          const details = await response.json();
          setSelectedContent(prev => ({ ...prev, ...details }));
        }
      } catch (error) {
        console.error('Failed to fetch lesson details', error);
      } finally {
        setIsLoadingContent(false);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <PlayCircle className="h-4 w-4 mr-2" />;
      case 'quiz': return <CheckSquare className="h-4 w-4 mr-2" />;
      case 'assignment': return <FileText className="h-4 w-4 mr-2" />;
      default: return <PlayCircle className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-2">
        <Card className="h-[600px]">
          <CardContent className="flex items-center justify-center h-full p-6">
            {isLoadingContent ? (
              <div className="text-center">Loading content...</div>
            ) : selectedContent ? (
              <div className="w-full" key={selectedContent.id}>
                <h2 className="text-3xl font-bold mb-4">{selectedContent.title}</h2>
                {selectedContent.type === 'lesson' && selectedContent.video_url && (
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={selectedContent.video_url.replace('watch?v=', 'embed/')}
                      title={selectedContent.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                {selectedContent.type === 'lesson' && selectedContent.content && (
                  <div className="prose max-w-none mt-4" dangerouslySetInnerHTML={{ __html: selectedContent.content }} />
                )}
                {selectedContent.type === 'quiz' && (
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold">Quiz Ready</h3>
                    <p className="text-gray-600 my-4">You are about to start the quiz. Make sure you are prepared.</p>
                    <Button onClick={() => {
                      console.log(`Navigating to /quizzes/${selectedContent.id}`);
                      router.push(`/quizzes/${selectedContent.id}`);
                    }}>
                      Start Quiz
                    </Button>
                  </div>
                )}
                {selectedContent.type === 'assignment' && <div className="mt-4">Assignment details will be here.</div>}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">Select a lesson from the sidebar to begin.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Curriculum Sidebar */}
      <div>
        <h2 className="text-xl font-bold mb-4">Course Content</h2>
        <Card>
          <CardContent className="p-2">
            <Accordion type="multiple" defaultValue={course.curriculum?.map(s => s.id)} className="w-full">
              {course.curriculum?.map((section) => (
                <AccordionItem value={section.id} key={section.id}>
                  <AccordionTrigger className="font-semibold">{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {section.lessons?.map((lesson) => (
                        <button key={lesson.id} onClick={() => handleSelectContent(lesson)} className={`w-full text-left flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer ${selectedContent?.id === lesson.id ? 'bg-blue-100' : ''}`}>
                          {getIcon(lesson.type)}
                          {lesson.title}
                        </button>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
