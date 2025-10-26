"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, BookOpen, FileText, Award } from 'lucide-react';

type LessonType = 'lesson' | 'quiz' | 'assignment' | 'video' | 'document' | 'video_file';
interface Lesson { id: string; title: string; description?: string; type?: LessonType; duration?: number; completed?: boolean; video_url?: string; file_url?: string; attachment_url?: string }
interface Section { id: string; title: string; lessons: Lesson[] }

export default function CourseMainClient({ initialCurriculum, courseId }: { initialCurriculum: Section[]; courseId: string }) {
  const router = useRouter();
  const [curriculum, setCurriculum] = useState<Section[]>(initialCurriculum || []);
  const allLessons = curriculum.flatMap(s => s.lessons || []);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    const current = allLessons.find(l => !l.completed) || allLessons[0];
    if (current && !selectedLessonId) setSelectedLessonId(current.id);
  }, [curriculum]);

  useEffect(() => {
    const onSelect = (ev: any) => {
      const { lessonId } = ev.detail || {};
      console.log('main: lesson:selected received', lessonId);
      if (!lessonId) return;
      setSelectedLessonId(lessonId);
    };

    const onChange = (ev: any) => {
      const { lessonId, completed } = ev.detail || {};
      console.log('main: lesson:completion event', ev.type, lessonId, completed);
      if (!lessonId) return;
      setCurriculum(prev => prev.map(s => ({ ...s, lessons: s.lessons.map(l => l.id === lessonId ? { ...l, completed } : l) } )));
    };

    window.addEventListener('lesson:selected', onSelect as EventListener);
    window.addEventListener('lesson:completion-changed', onChange as EventListener);
    window.addEventListener('lesson:completion-confirmed', onChange as EventListener);

    return () => {
      window.removeEventListener('lesson:selected', onSelect as EventListener);
      window.removeEventListener('lesson:completion-changed', onChange as EventListener);
      window.removeEventListener('lesson:completion-confirmed', onChange as EventListener);
    };
  }, []);

  const selectedLesson = allLessons.find(l => l.id === selectedLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex(l => l.id === selectedLesson?.id);
  const previousLesson = allLessons[currentIndex - 1];
  const nextLesson = allLessons[currentIndex + 1];

  // Debug: log selected lesson for troubleshooting preview issues
  useEffect(() => {
    console.log('course-main: selectedLesson', selectedLesson);
  }, [selectedLesson]);

  const getLessonTypeLabel = (type?: LessonType) => {
    switch (type) {
      case 'video': case 'video_file': return 'Video Lesson';
      case 'quiz': return 'Quiz';
      case 'assignment': return 'Assignment';
      case 'document': return 'Document';
      default: return 'Lesson';
    }
  };

  // Infer a display label for lessons where `type` may be missing or inconsistent
  const inferDisplayLabel = (lesson?: Lesson) => {
    if (!lesson) return 'Lesson';
    const t = lesson.type;
    if (t) return getLessonTypeLabel(t);

    // If there's no explicit type, infer from available fields
    const desc = String(lesson.description || '');
    const title = String(lesson.title || '');
    const video = String(lesson.video_url || '');

    // Assignment-like: has description/instructions and no embeddable video URL, or title contains 'assign'
    if ((!video || video.trim() === '') && (desc.trim() !== '' || /assign/i.test(title))) return 'Assignment';

    // Document-like: PDF url or file hint
    try {
      if (video.toLowerCase().endsWith('.pdf')) return 'Document';
      if (/\.pdf(\?|$)/i.test(video)) return 'Document';
    } catch (e) {}

    return 'Lesson';
  };

  const onNavigate = (lesson?: Lesson) => {
    if (!lesson) return;
    setSelectedLessonId(lesson.id);
    window.dispatchEvent(new CustomEvent('lesson:selected', { detail: { lessonId: lesson.id } }));
  };

  // Build the main preview content once to avoid complex nested ternaries and TypeScript narrowing
  const mainContent = (() => {
    // Document or Assignment preview should take precedence over raw video file rendering
    // Also treat lessons whose `video_url` points to a PDF as documents so they render in an iframe.
    const isPdfUrl = (() => {
      try {
        const u = String(selectedLesson.video_url || '');
        return /\.pdf(\?|$)/i.test(u);
      } catch (e) {
        return false;
      }
    })();

    const isAssignmentOrDocument = (selectedLesson.type === 'document' || selectedLesson.type === 'assignment') || (!selectedLesson.video_url && (selectedLesson.description || /assignment/i.test(String(selectedLesson.title || '')))) || isPdfUrl;
    if (isAssignmentOrDocument) {
      return (
        <div className="bg-white rounded-2xl overflow-hidden border mb-6">
          {selectedLesson.video_url ? (
            (() => {
              const urlStr = selectedLesson.video_url as string;
              try {
                const url = new URL(urlStr);
                const host = url.hostname.replace('www.', '');
                const isPdf = url.pathname.toLowerCase().endsWith('.pdf');
                const isVideoFile = /\.(mp4|webm|ogg)$/i.test(url.pathname);
                const isYouTube = host.includes('youtube.com') || host.includes('youtu.be');

                if (isPdf) {
                  return <iframe src={urlStr} className="w-full h-[600px]" />;
                }

                if (isYouTube) {
                  const vid = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
                  const embedUrl = vid ? `https://www.youtube.com/embed/${vid}` : urlStr;
                  return (
                    <div className="aspect-video bg-black rounded-2xl mb-6 overflow-hidden">
                      <iframe className="w-full h-full" src={embedUrl} title={selectedLesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    </div>
                  );
                }

                if (isVideoFile) {
                  return <video className="w-full h-[600px] object-cover" controls src={urlStr} />;
                }

                return (
                  <div className="p-8 text-center text-gray-700">
                    <p className="mb-4">Preview not available. Open the resource to view it.</p>
                    <a className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg" href={urlStr} target="_blank" rel="noreferrer">Open Resource</a>
                  </div>
                );
              } catch (e) {
                console.warn('Invalid resource URL for lesson', selectedLesson.id, selectedLesson.video_url, e);
                return (
                  <div className="p-8 text-center text-gray-700">
                    <p className="mb-4">Preview not available.</p>
                    <a className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg" href={String(selectedLesson.video_url || '#')} target="_blank" rel="noreferrer">Open Resource</a>
                  </div>
                );
              }
            })()
          ) : (
            <div className="p-8 text-left text-gray-700">
              <p className="mb-4">{selectedLesson.description || 'No preview available for this item.'}</p>
              <div>
                {(() => {
                  const resource = selectedLesson.video_url || (selectedLesson as any).file_url || (selectedLesson as any).attachment_url;
                  if (resource) {
                    return (
                      <a className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl" href={String(resource)} target="_blank" rel="noreferrer">Open Assignment</a>
                    );
                  }
                  if (String(selectedLesson.id).startsWith('assignment-')) {
                    const aid = String(selectedLesson.id).replace(/^assignment-/, '');
                    return (
                      <button onClick={() => router.push(`/assignments/${aid}`)} className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl">Open Assignment</button>
                    );
                  }
                  return (
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl">Open Assignment</button>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      );
    }

  // If not a document/assignment, but there's a video_url, show the player
  if (selectedLesson.video_url) {
      return (
        <div className="aspect-video bg-black rounded-2xl mb-6 overflow-hidden">
          {(() => {
            const urlStr = selectedLesson.video_url as string;
            try {
              const url = new URL(urlStr);
              // Helper: build embed URL for YouTube links
              const getYouTubeEmbed = (u: URL) => {
                const h = u.hostname.replace('www.', '');
                if (h === 'youtu.be') {
                  const vid = u.pathname.slice(1);
                  return vid ? `https://www.youtube.com/embed/${vid}${u.search || ''}` : null;
                }
                if (h.endsWith('youtube.com')) {
                  if (u.pathname.startsWith('/embed/')) return u.toString();
                  const v = u.searchParams.get('v');
                  if (v) return `https://www.youtube.com/embed/${v}`;
                }
                return null;
              };

              const embedUrl = getYouTubeEmbed(url);
              if (embedUrl) {
                return (
                  <iframe
                    className="w-full h-full"
                    src={embedUrl}
                    title={selectedLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                );
              }
              // Not a YouTube link — treat as a normal video file or signed URL
              return <video className="w-full h-full object-cover" controls src={urlStr} />;
            } catch (e) {
              console.warn('Invalid video URL for lesson', selectedLesson.id, selectedLesson.video_url, e);
              return <video className="w-full h-full object-cover" controls src={String(selectedLesson.video_url)} />;
            }
          })()}
        </div>
      );
    }

    // Quiz preview
    if (selectedLesson.type === 'quiz') {
      return (
        <div className="bg-white rounded-2xl p-8 border mb-6">
          <h3 className="text-lg font-semibold mb-4">Quiz Preview</h3>
          <p className="text-gray-600 mb-4">This is a quiz item. When you press Start, you will be taken to the quiz interface.</p>
          <button onClick={() => {
            const params = new URLSearchParams();
            params.set('courseId', courseId || '');
            params.set('role', 'student');
            const section = curriculum.find(s => s.lessons.some(l => l.id === selectedLesson.id));
            if (section) params.set('sectionId', section.id);
            router.push(`/quizzes/${selectedLesson.id}?${params.toString()}`);
          }} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">Start Quiz</button>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="bg-white rounded-2xl p-8 border mb-6">
        <p className="text-gray-700">{selectedLesson.description || 'No preview available for this lesson type.'}</p>
      </div>
    );
  })();

  if (!selectedLesson) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
              {inferDisplayLabel(selectedLesson)}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h2>
            {selectedLesson.description && (
              <p className="text-gray-600 mt-2">{selectedLesson.description}</p>
            )}
          </div>
        </div>

        <div className="mb-6">{mainContent}</div>

        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate(previousLesson)}
            className={`flex items-center space-x-2 px-4 py-2 transition-colors ${previousLesson ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
            disabled={!previousLesson}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <BookOpen className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <FileText className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Award className="h-5 w-5" />
            </button>
          </div>
          
          <button 
            onClick={() => onNavigate(nextLesson)}
            className={`flex items-center space-x-2 px-4 py-2 transition-colors ${nextLesson ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
            disabled={!nextLesson}
          >
            <span>Next</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Resources / Community / Progress panels removed per request */}
    </div>
  );
}
