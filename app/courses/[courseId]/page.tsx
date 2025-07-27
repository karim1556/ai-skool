import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Star,
  PlayCircle,
  Download,
  Users,
  BookOpen,
  MessageSquare,
  Clock,
  BarChart2,
  Link as LinkIcon,
  ShoppingCart,
  FileText,
  Check,
  Globe,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { getDb } from "@/lib/db";

// Define the types based on your API response
interface Instructor {
  name: string;
  image: string;
  title: string;
  bio: string;
  courses_count: number;
  students_count: number;
  average_rating: number;
  reviews_count: number;
}

interface Lesson {
  title: string;
  duration: string;
  type?: 'lesson' | 'quiz' | 'assignment';
  is_preview?: boolean;
  id?: string | number;
  description?: string;
  content?: string;
  url?: string;
  sort_order?: number;
}

interface CurriculumSection {
  id: string | number;
  title: string;
  description?: string;
  sort_order?: number;
  course_id?: string | number;
  lessons: Lesson[];
}

interface Attachment {
  title: string;
  url: string;
}

interface ExternalLink {
  title: string;
  url: string;
}

interface Review {
  id: string;
  user: string;
  user_image: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  objectives: string[];
  rating: number;
  reviews_count: number;
  enrolled_students_count: number;
  price: number;
  original_price?: number;
  duration: string;
  level: string;
  last_updated: string;
  demo_video_url: string;
  video_preview_image: string;
  instructor: Instructor;
  curriculum: CurriculumSection[];
  attachments: Attachment[];
  external_links: ExternalLink[];
  reviews: Review[];
}

async function getCourse(courseId: string): Promise<Course | null> {
  console.log('=== Starting getCourse ===');
  console.log('Course ID:', courseId);
  
  let db;
  try {
    db = await getDb();
    if (!db) {
      console.error('❌ Database connection failed');
      return null;
    }
    console.log('✅ Database connection successful');
    
    // 1. Fetch basic course data
    console.log('🔍 Fetching course with ID:', courseId);
    const courseQuery = `
      SELECT 
        c.*, 
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as enrolled_students_count,
        (SELECT AVG(rating) FROM reviews WHERE course_id = c.id) as average_rating,
        (SELECT COUNT(*) FROM reviews WHERE course_id = c.id) as reviews_count
      FROM courses c 
      WHERE c.id = $1`;
      
    const courseResult = await db.get(courseQuery, [courseId]);
    if (!courseResult) {
      console.error('❌ No course found with ID:', courseId);
      return null;
    }
    console.log('✅ Found course:', courseResult.title);

    // 2. Fetch instructor with fallback if course_instructors doesn't exist
    console.log('\n🔍 Fetching instructor for course...');
    let instructor = null;
    try {
      instructor = await db.get(`
        SELECT p.* FROM profiles p
        JOIN course_instructors ci ON p.id = ci.instructor_id
        WHERE ci.course_id = $1 LIMIT 1
      `, [courseId]);
      console.log('✅ Instructor data:', instructor ? 'Found' : 'Not found in course_instructors');
      
      // Fallback to course creator if no instructor found
      if (!instructor && courseResult.created_by) {
        instructor = await db.get('SELECT * FROM profiles WHERE id = $1', [courseResult.created_by]);
        console.log('✅ Using course creator as instructor:', instructor ? 'Found' : 'Not found');
      }
    } catch (error) {
      const err = error as Error;
      console.warn('⚠️ Instructor fetch failed, using fallback:', err.message);
      // Fallback to a default instructor
      instructor = {
        name: 'Instructor',
        image: '/default-avatar.png',
        title: 'Course Instructor',
        bio: 'Experienced educator with a passion for teaching',
        courses_count: 1,
        students_count: courseResult.enrolled_students_count || 0,
        average_rating: courseResult.average_rating || 4.5,
        reviews_count: courseResult.reviews_count || 0
      };
    }

    // 3. Fetch curriculum (sections + lessons)
    console.log('\n🔍 Fetching curriculum...');
    let curriculum = [];
    
    try {
      // First, try fetching sections and lessons in a single query
      const curriculumQuery = `
        WITH course_sections AS (
          SELECT * FROM sections 
          WHERE course_id = $1 
          ORDER BY sort_order ASC
        )
        SELECT 
          s.id as section_id,
          s.title as section_title,
          s.sort_order as section_sort_order,
          l.id as lesson_id,
          l.title as lesson_title,
          l.type as lesson_type,
          l.duration as lesson_duration,
          l.is_preview as is_preview,
          l.sort_order as lesson_sort_order,
          l.content as content
        FROM course_sections s
        LEFT JOIN lessons l ON s.id = l.section_id
        ORDER BY s.sort_order, l.sort_order`;
      
      const curriculumResults = await db.all(curriculumQuery, [courseId]);
      
      // Group by sections
      const sectionsMap = new Map();
      
      curriculumResults.forEach(row => {
        if (!sectionsMap.has(row.section_id)) {
          sectionsMap.set(row.section_id, {
            id: row.section_id,
            title: row.section_title,
            sort_order: row.section_sort_order || 0,
            lessons: []
          });
        }
        
        if (row.lesson_id) {
          sectionsMap.get(row.section_id).lessons.push({
            id: row.lesson_id,
            title: row.lesson_title,
            type: row.lesson_type || 'lesson',
            duration: row.lesson_duration ? `${row.lesson_duration} min` : '5 min',
            is_preview: Boolean(row.is_preview),
            sort_order: row.lesson_sort_order || 0,
            content: row.content
          });
        }
      });
      
      curriculum = Array.from(sectionsMap.values());
      console.log(`✅ Found ${curriculum.length} sections with lessons`);
      
    } catch (error) {
      const err = error as Error;
      console.error('❌ Error fetching curriculum:', err);
      // Fallback to empty curriculum
      curriculum = [];
    }
    


    // 4. Fetch reviews with fallback
    console.log('\n🔍 Fetching reviews...');
    let reviews = [];
    try {
      reviews = await db.all(`
        SELECT 
          r.*, 
          COALESCE(p.full_name, 'Anonymous') as user, 
          COALESCE(p.image, '/default-avatar.png') as user_image 
        FROM reviews r
        LEFT JOIN profiles p ON r.user_id = p.id
        WHERE r.course_id = $1 
        ORDER BY r.created_at DESC
      `, [courseId]);
      console.log(`✅ Found ${reviews.length} reviews`);
    } catch (error) {
      const err = error as Error;
      console.warn('⚠️ Could not fetch reviews:', err.message);
      reviews = [];
    }

    // 5. Assemble and sanitize the final course object
    const courseData: Course = {
      id: courseResult.id,
      title: courseResult.title,
      tagline: courseResult.tagline || courseResult.title,
      description: courseResult.description || 'No description available',
      objectives: Array.isArray(courseResult.objectives) ? 
        courseResult.objectives : 
        (courseResult.objectives ? [courseResult.objectives] : ['Learn valuable skills']),
      rating: parseFloat(courseResult.average_rating) || 4.5,
      reviews_count: parseInt(courseResult.reviews_count) || 0,
      enrolled_students_count: parseInt(courseResult.enrolled_students_count) || 0,
      price: parseFloat(courseResult.price) || 0,
      original_price: parseFloat(courseResult.original_price) || 0,
      duration: courseResult.duration_hours ? 
        `${courseResult.duration_hours} hours` : 'Self-paced',
      level: courseResult.level || 'All Levels',
      last_updated: new Date(courseResult.updated_at || courseResult.created_at).toISOString(),
      demo_video_url: courseResult.demo_video_url || '',
      video_preview_image: courseResult.video_preview_image || '/placeholder-course.jpg',
      instructor: instructor || {
        name: 'Instructor',
        image: '/default-avatar.png',
        title: 'Course Instructor',
        bio: 'Experienced educator with a passion for teaching',
        courses_count: 1,
        students_count: courseResult.enrolled_students_count || 0,
        average_rating: courseResult.average_rating || 4.5,
        reviews_count: courseResult.reviews_count || 0
      },
      curriculum: curriculum,
      reviews: reviews,
      attachments: Array.isArray(courseResult.attachments) ? 
        courseResult.attachments : 
        (courseResult.attachments ? [courseResult.attachments] : []),
      external_links: Array.isArray(courseResult.external_links) ? 
        courseResult.external_links : 
        (courseResult.external_links ? [courseResult.external_links] : [])
    };

    // Log final data (without logging the full content to avoid cluttering)
    console.log('\n🎉 Final course data:', {
      id: courseData.id,
      title: courseData.title,
      sections: courseData.curriculum?.length || 0,
      totalLessons: courseData.curriculum?.reduce((sum, section) => sum + (section.lessons?.length || 0), 0) || 0,
      hasInstructor: !!courseData.instructor,
      reviewCount: courseData.reviews.length
    });

    return courseData;

  } catch (error) {
    console.error("Failed to fetch course directly:", error);
    return null;
  }
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = await getCourse(params.courseId);

  if (!course) {
    notFound();
  }

  // Calculate derived values
  const lessonsCount = course.curriculum?.reduce((acc: number, section: CurriculumSection) => acc + (section.lessons?.length || 0), 0) || 0;
  const discount = course.original_price && course.price ? Math.round(((course.original_price - course.price) / course.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">{course.title}</h1>
            <p className="text-xl text-gray-300">{course.tagline}</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-yellow-400">{course.rating.toFixed(1)}</span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-gray-400">({course.reviews_count} ratings)</span>
              <span className="text-gray-400">{course.enrolled_students_count} students</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last updated {new Date(course.last_updated).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>{course.level} Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Language: English</span>
                </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* What you'll learn */}
          <Card className="p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.objectives?.map((item: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card className="p-6 shadow-sm">
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Course content</h2>
                <span className="text-sm text-gray-500">
                  {lessonsCount} {lessonsCount === 1 ? 'lesson' : 'lessons'}
                </span>
              </div>
              
              {course.curriculum?.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {course.curriculum.map((section: CurriculumSection, index: number) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="font-semibold text-lg">
                        <div className="flex items-center">
                          <span>{section.title}</span>
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({section.lessons?.length || 0} {section.lessons?.length === 1 ? 'item' : 'items'})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {section.lessons?.length > 0 ? (
                          <ul className="space-y-2 pl-4">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                  {lesson.type === 'quiz' ? (
                                    <FileText className="h-4 w-4 text-blue-500" />
                                  ) : lesson.type === 'assignment' ? (
                                    <ClipboardList className="h-4 w-4 text-purple-500" />
                                  ) : (
                                    <PlayCircle className="h-4 w-4 text-green-500" />
                                  )}
                                  <span className="text-gray-700">{lesson.title}</span>
                                  {lesson.is_preview && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                      Preview
                                    </span>
                                  )}
                                </div>
                                {lesson.duration && (
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No lessons in this section yet.
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No content yet</h3>
                  <p className="mt-1 text-sm text-gray-500">This course doesn't have any sections or lessons yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>

          {/* Attachments */}
          {course.attachments && course.attachments.length > 0 && (
            <Card className="p-6 shadow-sm">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Attachments</h2>
                <ul className="space-y-3">
                  {course.attachments.map((attachment: Attachment, index: number) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">{attachment.title}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={attachment.url} download>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Useful Links */}
          {course.external_links && course.external_links.length > 0 && (
            <Card className="p-6 shadow-sm">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Useful Links</h2>
                <ul className="space-y-3">
                  {course.external_links.map((link: ExternalLink, index: number) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <LinkIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">{link.title}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          Visit
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Instructor */}
          {course.instructor && (
            <Card className="p-6 shadow-sm">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <Image
                    src={course.instructor.image || "/placeholder.svg"}
                    alt={course.instructor.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">{course.instructor.name}</h3>
                    <p className="text-gray-600 text-sm">{course.instructor.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{course.instructor.bio}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.instructor.courses_count || 0} Courses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.instructor.students_count || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.instructor.average_rating || 0} Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{course.instructor.reviews_count || 0} Reviews</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Student Feedback */}
          <Card className="p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Feedback</h2>
              <div className="space-y-6">
                {course.reviews?.map((review: Review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user_image} alt={review.user} />
                          <AvatarFallback>
                            {review.user
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{review.user}</p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sticky Course Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardContent className="p-0">
              <div className="relative">
                {/* Video Player */}
                <video
                  controls
                  poster={course.video_preview_image || "/placeholder.svg"}
                  className="w-full h-auto object-cover rounded-t-lg"
                >
                  <source src={course.demo_video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-pink-600">₹{course.price}</span>
                    {course.original_price && (
                      <span className="text-lg text-gray-500 line-through">₹{course.original_price}</span>
                    )}
                  </div>
                  {discount > 0 && (
                    <Badge className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration} of video content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{lessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    <span>{course.level} Level</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-sky-500 text-sky-500 hover:bg-sky-50 font-semibold py-3 rounded-lg transition-colors duration-200 bg-transparent"
                >
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}