import CoursePlaybackClientV2 from '@/components/courses/course-playback-client-v2';
import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Define the types for the data we expect from the database and the final shape
type LessonType = 'lesson' | 'quiz' | 'assignment' | 'video' | 'document' | 'video_file';

interface Lesson {
  id: string;
  title: string;
  content?: string;
  type: LessonType;
  duration?: number;
  video_url?: string;
  completed?: boolean; // Client-side state
  file_url?: string; // For lesson video files
  attachment_url?: string; // For assignment attachments
  instructions?: string; // For assignment instructions
  description?: string; // For assignment description
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
  // Ensure params is resolved before destructuring
  const resolvedParams = await Promise.resolve(params);
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

        // First get the raw lesson data
        const rawLessons = await db.all<any>(
          `SELECT * FROM lessons WHERE section_id = $1 ORDER BY sort_order`, 
          [section.id]
        );
        
        // Process lessons to handle video URLs
        const lessons: Lesson[] = rawLessons?.map(lesson => {
          // Use file_url if available, otherwise fall back to content
          const videoUrl = lesson.file_url || lesson.content;
          
          return {
            ...lesson,
            video_url: videoUrl,
            type: lesson.type as LessonType // Preserve original type
          };
        }) || [];
        

        
        const quizzes: Lesson[] | undefined = await db.all('SELECT id, title, \'quiz\' as type FROM quizzes WHERE section_id = $1', [section.id]);
        
        // Fetch and process assignments
        const rawAssignments = await db.all<any>('SELECT * FROM assignments WHERE section_id = $1', [section.id]);
        const assignments: Lesson[] = rawAssignments?.map((assignment: any) => ({
          id: `assignment-${assignment.id}`,
          title: assignment.title,
          type: 'assignment' as const,
          content: assignment.instructions, // Instructions for display
          attachment_url: assignment.attachment_url, // URL to be signed
          description: assignment.description,
          // Explicitly set file_url from attachment_url for assignments to standardize the signing logic
          file_url: assignment.attachment_url, 
        })) || [];

        const allItems = [...(lessons || []), ...(quizzes || []), ...(assignments || [])];


        // Generate signed URLs for lessons and assignments with a file/video URL
        for (const item of allItems) {
          const urlString = item.file_url;

          if (urlString) {
            let path = '';
            // Check if it's a full URL or just a path
            if (urlString.startsWith('http')) {
              try {
                const url = new URL(urlString);
                // The path is what comes after '/public/course-files/' or '/course-files/'
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
              // It's already just a path
              path = urlString;
            }

            if (path) {
              try {
                const { data, error } = await supabase.storage
                  .from('course-files')
                  .createSignedUrl(path, 3600); // 1 hour expiry

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

    return <CoursePlaybackClientV2 course={course} />;

  } catch (error) {
    console.error('Failed to fetch course playback data:', error);
    return <div>Error loading course. Please try again later.</div>;
  }
}
 