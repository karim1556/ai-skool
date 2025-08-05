import CoursePlaybackClientV2 from '@/components/courses/course-playback-client-v2';
import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Define the types for the data we expect from the database and the final shape
interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: 'lesson' | 'quiz' | 'assignment';
  duration?: number;
  video_url?: string;
  completed?: boolean; // Client-side state
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

// This server component is now lean and focused on data fetching and shaping.
export default async function CoursePlaybackPage({ params }: PlaybackPageProps) {
  const { courseId } = params;
  const db = await getDb();

  try {
    const courseData: { id: string; title: string; overview: string } | null | undefined = await db.get('SELECT id, title, description as overview FROM courses WHERE id = $1', [courseId]);
    if (!courseData) {
      notFound();
    }

    const sectionsData: { id: string; title: string }[] | undefined = await db.all('SELECT id, title FROM sections WHERE course_id = $1 ORDER BY sort_order', [courseId]);

    const curriculum = await Promise.all(
      (sectionsData || []).map(async (section) => {
        const lessons: Lesson[] | undefined = await db.all('SELECT id, title, content, video_url, duration, \'lesson\' as type FROM lessons WHERE section_id = $1 ORDER BY sort_order', [section.id]);
        const quizzes: Lesson[] | undefined = await db.all('SELECT id, title, \'quiz\' as type FROM quizzes WHERE section_id = $1', [section.id]);
        const assignments: Lesson[] | undefined = await db.all('SELECT id, title, \'assignment\' as type FROM assignments WHERE section_id = $1', [section.id]);

        const allItems = [...(lessons || []), ...(quizzes || []), ...(assignments || [])];

        // Generate signed URLs for lessons with video_url
        for (const item of allItems) {
          if (item.type === 'lesson' && item.video_url) {
            // Extract the path from the full URL stored in the DB
            try {
              const urlObject = new URL(item.video_url);
              const path = urlObject.pathname.split('/course-files/')[1];

              if (path) {
                const { data, error } = await supabase.storage
                  .from('course-files')
                  .createSignedUrl(path, 3600); // URL valid for 1 hour

                if (error) {
                  console.error('Error generating signed URL:', error);
                } else {
                  item.video_url = data.signedUrl;
                }
              }
            } catch (e) {
              console.error('Invalid URL for Supabase signing:', item.video_url, e);
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

    return <CoursePlaybackClientV2 course={course} />;

  } catch (error) {
    console.error('Failed to fetch course playback data:', error);
    return <div>Error loading course. Please try again later.</div>;
  }
}
 