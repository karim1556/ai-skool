import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import CoursePlayback from '@/components/courses/course-playback';

// Define types for server-side data fetching
interface Lesson {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
}

interface Section {
  id: string;
  title: string;
  lessons?: Lesson[];
}

interface Course {
  id: string;
  title: string;
  curriculum?: Section[];
}

// This function runs only on the server
async function getCourseForPlayback(courseId: string): Promise<Course | null> {
  const db = await getDb();
  try {
    const course = await db.get<Course>('SELECT id, title FROM courses WHERE id = $1', [courseId]);
    if (!course) return null;

    const sections = await db.all<Section>('SELECT id, title FROM sections WHERE course_id = $1 ORDER BY sort_order', [courseId]);

    for (const section of sections) {
      const lessons = await db.all<Lesson>(`SELECT id, title, 'lesson' as type FROM lessons WHERE section_id = $1`, [section.id]);
      const quizzes = await db.all<Lesson>(`SELECT id, title, 'quiz' as type FROM quizzes WHERE section_id = $1`, [section.id]);
      const assignments = await db.all<Lesson>(`SELECT id, title, 'assignment' as type FROM assignments WHERE section_id = $1`, [section.id]);
      section.lessons = [...lessons, ...quizzes, ...assignments];
    }

    course.curriculum = sections;
    return course as Course;
  } catch (error) {
    console.error('Failed to fetch course for playback:', error);
    return null;
  }
}

// This is a Server Component
export default async function CoursePlaybackPage({ params }: { params: { courseId: string } }) {
  const course = await getCourseForPlayback(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* All interactivity is handled by the Client Component */}
        <CoursePlayback course={course} />
      </main>
    </div>
  );
}

