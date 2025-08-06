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
        console.log(`Fetching lessons for section ${section.id}`);
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
            video_url: videoUrl,  // Use file_url as the video source
            item_type: 'lesson',
            type: 'lesson' as const
          };
        }) || [];
        
        console.log(`Processed lessons for section ${section.id}:`, JSON.stringify(lessons, null, 2));
        
        const quizzes: Lesson[] | undefined = await db.all('SELECT id, title, \'quiz\' as type FROM quizzes WHERE section_id = $1', [section.id]);
        const assignments: Lesson[] | undefined = await db.all('SELECT id, title, \'assignment\' as type FROM assignments WHERE section_id = $1', [section.id]);

        const allItems = [...(lessons || []), ...(quizzes || []), ...(assignments || [])];
        console.log(`All items for section ${section.id}:`, JSON.stringify(allItems, null, 2));

        // Generate signed URLs for lessons with video_url
        for (const item of allItems) {
          if (item.type === 'lesson' && item.video_url) {
            console.log('Processing video URL for lesson:', item.id, 'Original URL:', item.video_url);
            
            try {
              let path = '';
              
              // Check if it's already a full URL
              if (item.video_url.startsWith('http')) {
                const url = new URL(item.video_url);
                console.log('Full URL detected. Pathname:', url.pathname);
                
                // Try different URL patterns to extract the path
                if (url.pathname.includes('/storage/v1/object/public/')) {
                  path = url.pathname.split('/storage/v1/object/public/course-files/')[1];
                } else if (url.pathname.includes('/storage/v1/object/sign/')) {
                  // Handle signed URLs
                  const match = url.pathname.match(/\/storage\/v1\/object\/sign\/course-files\/([^?]+)/);
                  path = match ? match[1] : '';
                } else {
                  // Try to extract just the file path
                  const parts = url.pathname.split('/');
                  path = parts[parts.length - 1];
                }
                
                console.log('Extracted path from URL:', path);
              } else {
                // Handle case where it's just a path
                path = item.video_url.replace(/^\/course-files\//, '');
                console.log('Using direct path:', path);
              }
              
              if (path) {
                console.log('Generating signed URL for path:', path);
                const { data, error } = await supabase.storage
                  .from('course-files')
                  .createSignedUrl(path, 3600);

                if (!error && data) {
                  console.log('Successfully generated signed URL:', data.signedUrl);
                  item.video_url = data.signedUrl;
                } else {
                  console.error('Error generating signed URL. Error:', error, 'For path:', path);
                  
                  // Try to list files to debug bucket contents
                  try {
                    console.log('Attempting to list files in bucket...');
                    const { data: files, error: listError } = await supabase.storage
                      .from('course-files')
                      .list();
                      
                    if (!listError) {
                      console.log('Files in bucket:', files);
                    } else {
                      console.error('Error listing files:', listError);
                    }
                  } catch (listErr) {
                    console.error('Exception while listing files:', listErr);
                  }
                }
              } else {
                console.error('Could not extract valid path from URL:', item.video_url);
              }
            } catch (e) {
              console.error('Error processing video URL:', item.video_url, 'Error:', e);
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
 