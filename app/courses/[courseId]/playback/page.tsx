import CoursePlaybackClientV2 from '@/components/courses/course-playback-client-v2'
import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BookOpen, Play, FileText, Clock, Award, Users, BarChart3 } from 'lucide-react';
import CompletionToggle from '@/components/courses/completion-toggle';
import CourseSidebarClient from '@/components/courses/course-sidebar-client';
import CourseSidebarWrapper from '@/components/courses/course-sidebar-wrapper';
import CourseHeaderClient from '@/components/courses/course-header-client';
import CourseMainClient from '@/components/courses/course-main-client';

// Define the types for the data we expect from the database and the final shape
type LessonType = 'lesson' | 'quiz' | 'assignment' | 'video' | 'document' | 'video_file';

interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: LessonType;
  duration?: number;
  video_url?: string;
  completed?: boolean;
  file_url?: string;
  attachment_url?: string;
  instructions?: string;
  description?: string;
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

interface PlaybackPageProps {
  params: { courseId: string };
}

// Helper function to calculate course statistics
function calculateCourseStats(curriculum: Section[]) {
  const allLessons = curriculum.flatMap(section => section.lessons || []);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(lesson => Boolean(lesson.completed)).length;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Ensure durations are numeric and ignore invalid values
  const totalDuration = allLessons.reduce((total, lesson) => {
    const d = Number((lesson as any).duration) || 0;
    return total + d;
  }, 0);
  const hours = Number.isFinite(totalDuration) ? Math.floor(totalDuration / 3600) : 0;
  const minutes = Number.isFinite(totalDuration) ? Math.floor((totalDuration % 3600) / 60) : 0;

  const lessonsByType = allLessons.reduce((acc, lesson) => {
    const t = (lesson as any).type || 'lesson';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalLessons,
    completedLessons,
    progress,
    totalDuration: { hours, minutes },
    inProgressLessons: allLessons.filter(lesson => !lesson.completed && lesson !== allLessons[0]).length,
    lessonsByType
  };
}

// Enhanced Course Header Component with dynamic data
function CourseHeader({ course }: { course: Course }) {
  const stats = calculateCourseStats(course.curriculum);
  
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl mb-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-blue-100 font-semibold">Active Course</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
              {course.overview || "Master new skills with interactive lessons and hands-on projects"}
            </p>
          </div>
          
          {/* Dynamic Course Stats */}
          <div className="hidden lg:flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalLessons}</div>
              <div className="text-blue-100 text-sm">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats.totalDuration.hours > 0 ? `${stats.totalDuration.hours}h ` : ''}
                {stats.totalDuration.minutes}m
              </div>
              <div className="text-blue-100 text-sm">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.progress}%</div>
              <div className="text-blue-100 text-sm">Progress</div>
            </div>
          </div>
        </div>
        
        {/* Dynamic Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Course Progress</span>
            <span>{stats.completedLessons} of {stats.totalLessons} lessons completed</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full shadow-lg shadow-green-500/25 transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Curriculum Sidebar with dynamic completion states
function CurriculumSidebar({ curriculum, courseId }: { curriculum: Section[]; courseId: string }) {
  const stats = calculateCourseStats(curriculum);
  const allLessons = curriculum.flatMap(section => section.lessons || []);
  const currentLesson = allLessons.find(lesson => !lesson.completed) || allLessons[0];

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'video':
      case 'video_file':
        return <Play className="h-4 w-4" />;
      case 'quiz':
        return <FileText className="h-4 w-4" />;
      case 'assignment':
        return <Award className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>
            {stats.totalDuration.hours > 0 ? `${stats.totalDuration.hours}h ` : ''}
            {stats.totalDuration.minutes}m
          </span>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {curriculum.map((section, sectionIndex) => (
          <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Section {sectionIndex + 1}: {section.title}</h3>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{section.lessons.length} lessons</span>
              </div>
            </div>

            <div className="p-2">
              {section.lessons.map((lesson, lessonIndex) => {
                const isCurrentLesson = lesson.id === currentLesson?.id;
                return (
                  <div key={lesson.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer group border ${isCurrentLesson ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent hover:border-blue-200 hover:bg-blue-50'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${lesson.completed ? 'bg-gradient-to-br from-green-500 to-green-600' : isCurrentLesson ? 'bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>{lessonIndex + 1}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className={`${lesson.completed ? 'text-green-600' : isCurrentLesson ? 'text-blue-600' : 'text-gray-400'}`}>{getLessonIcon(lesson.type)}</div>
                        <h4 className={`text-sm font-medium truncate transition-colors ${lesson.completed ? 'text-gray-600 line-through' : isCurrentLesson ? 'text-blue-600 font-semibold' : 'text-gray-900 group-hover:text-blue-600'}`}>
                          {lesson.title}
                          {isCurrentLesson && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Current</span>}
                        </h4>
                      </div>
                      {(Number((lesson as any).duration) || 0) > 0 && (() => { const dur = Number((lesson as any).duration) || 0; const mins = Math.floor(dur / 60); const secs = Math.floor(dur % 60); return (<p className="text-xs text-gray-500 mt-1">{mins}m {secs}s</p>); })()}
                    </div>

                    <div className="flex-shrink-0">
                      <CompletionToggle completed={Boolean(lesson.completed)} lessonId={lesson.id} sectionId={section.id} courseId={courseId} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{stats.completedLessons}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{stats.inProgressLessons}</div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{stats.totalLessons - stats.completedLessons - stats.inProgressLessons}</div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Main Content Area with dynamic current lesson
function CourseContent({ course }: { course: Course }) {
  const allLessons = course.curriculum.flatMap(section => section.lessons);
  const currentLesson = allLessons.find(lesson => !lesson.completed) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLesson?.id);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const previousLesson = allLessons[currentLessonIndex - 1];

  const getLessonTypeLabel = (type: LessonType) => {
    switch (type) {
      case 'video':
      case 'video_file':
        return 'Video Lesson';
      case 'quiz':
        return 'Quiz';
      case 'assignment':
        return 'Assignment';
      default:
        return 'Lesson';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Lesson Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-2">
              {getLessonTypeLabel(currentLesson.type)}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
            {currentLesson.description && (
              <p className="text-gray-600 mt-2">{currentLesson.description}</p>
            )}
          </div>
          {/* Start/Review button removed per request */}
        </div>
        
        {/* Video Player Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Video player area (controls removed) - Start/Review controls removed per request */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
        
        {/* Lesson Navigation */}
        <div className="flex items-center justify-between">
          <button 
            className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
              previousLesson 
                ? 'text-gray-600 hover:text-gray-900' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
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
            className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
              nextLesson 
                ? 'text-gray-600 hover:text-gray-900' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
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

// Enhanced Wrapper Component
function EnhancedCoursePlayback({ course }: { course: Course }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Client-updating Course Header */}
        <CourseHeaderClient title={course.title} initialCurriculum={course.curriculum} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Curriculum (client interactive) */}
          <div className="lg:col-span-1">
            <CourseSidebarWrapper initialCurriculum={course.curriculum} courseId={course.id} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <CourseMainClient initialCurriculum={course.curriculum} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CoursePlaybackPage({ params }: PlaybackPageProps) {
  const resolvedParams: any = (params && typeof (params as any).then === 'function') ? await (params as any) : params;
  const { courseId } = resolvedParams;
  const db = await getDb();

  try {
    const courseData: { id: string; title: string; overview: string } | null | undefined = await db.get('SELECT id, title, description as overview FROM courses WHERE id = $1', [courseId]);
    if (!courseData) {
      notFound();
    }

    const sectionsData: { id: string; title: string }[] | undefined = await db.all('SELECT id, title FROM sections WHERE course_id = $1 ORDER BY sort_order', [courseId]);

    const curriculum = await Promise.all(
      (sectionsData || []).map(async (section) => {
        const rawLessons = await db.all<any>(
          `SELECT * FROM lessons WHERE section_id = $1 ORDER BY sort_order`, 
          [section.id]
        );
        
        const lessons: Lesson[] = rawLessons?.map(lesson => {
          const videoUrl = lesson.file_url || lesson.content;
          return {
            ...lesson,
            video_url: videoUrl,
            type: lesson.type as LessonType,
          };
        }) || [];

        const quizzes: Lesson[] | undefined = await db.all('SELECT id, title, \'quiz\' as type FROM quizzes WHERE section_id = $1', [section.id]);
        
        const rawAssignments = await db.all<any>('SELECT * FROM assignments WHERE section_id = $1', [section.id]);
        const assignments: Lesson[] = rawAssignments?.map((assignment: any) => {
          return {
            id: `assignment-${assignment.id}`,
            title: assignment.title,
            type: 'assignment' as const,
            content: assignment.instructions,
            attachment_url: assignment.attachment_url,
            description: assignment.description,
            file_url: assignment.attachment_url,
          };
        }) || [];

        const allItems = [...(lessons || []), ...(quizzes || []), ...(assignments || [])];

        // Generate signed URLs
        for (const item of allItems) {
          const urlString = item.file_url;
          if (urlString) {
            let path = '';
            if (urlString.startsWith('http')) {
              try {
                const url = new URL(urlString);
                const pathName = url.pathname;
                const pathParts = pathName.split('/course-files/');
                if (pathParts.length > 1) {
                  path = pathParts[1];
                }
              } catch (e) {
                console.error('Could not parse URL:', urlString, e);
                continue;
              }
            } else {
              path = urlString;
            }

            if (path) {
              try {
                const { data, error } = await supabase.storage
                  .from('course-files')
                  .createSignedUrl(path, 3600);
                if (error) {
                  console.error(`Failed to sign URL for path "${path}":`, error);
                } else if (data) {
                  item.video_url = data.signedUrl;
                }
              } catch (e) {
                console.error(`Exception when signing URL for path: ${path}`, e);
              }
            }
          }
        }

        return {
          ...section,
          lessons: allItems,
        };
      })
    );

    const course: Course = {
      ...courseData,
      curriculum,
    };

  // Render the enhanced server-side playback layout which composes
  // the header, sidebar and main content. It will still use the
  // client playback component for interactive pieces where needed.
  return <EnhancedCoursePlayback course={course} />;

  } catch (error) {
    console.error('Failed to fetch course playback data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Loading Failed</h2>
          <p className="text-gray-600 mb-6">We encountered an issue while loading the course. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }
}