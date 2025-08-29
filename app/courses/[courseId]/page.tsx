"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Award,
  InfinityIcon,
} from "lucide-react";
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
  try {
    // Construct the absolute URL for the API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL(`/api/courses/${courseId}/details`, baseUrl);

    const response = await fetch(url.toString(), {
      cache: 'no-store', // Ensure fresh data is fetched every time
    });

    if (!response.ok) {
      console.error(`API returned status ${response.status}: ${await response.text()}`);
      return null;
    }
    
    return await response.json() as Course;

  } catch (error) {
    console.error('An unexpected error occurred while fetching course data:', error);
    return null;
  }
}

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [showVideo, setShowVideo] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseLevels, setCourseLevels] = useState<any[]>([]);
  
  // Detect and transform YouTube URLs to embed form
  const getYouTubeEmbedUrl = (url: string | undefined | null): string | null => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, '');
      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
        // watch?v=VIDEO_ID or /shorts/VIDEO_ID
        if (u.pathname === '/watch') {
          const v = u.searchParams.get('v');
          return v ? `https://www.youtube.com/embed/${v}` : null;
        }
        if (u.pathname.startsWith('/shorts/')) {
          const id = u.pathname.split('/')[2];
          return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (u.pathname.startsWith('/embed/')) {
          return url; // already embed
        }
      }
      if (host === 'youtu.be') {
        const id = u.pathname.slice(1);
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    } catch {}
    return null;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourse(params.courseId);
      if (courseData) {
        setCourse(courseData);
      } else {
        notFound();
      }
    };
    fetchCourse();
  }, [params.courseId]);

  // Fetch levels for this course
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(`/api/courses/${params.courseId}/levels`, { cache: 'no-store' });
        const data = await res.json();
        setCourseLevels(Array.isArray(data) ? data : []);
      } catch {}
    };
    fetchLevels();
  }, [params.courseId]);

  // Autoplay demo video as soon as course data (and demo_video_url) is available
  useEffect(() => {
    if (course?.demo_video_url) {
      setShowVideo(true);
    }
  }, [course?.demo_video_url]);

  if (!course) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>; // Or a proper loading skeleton
  }

  const lessonsCount = course.curriculum?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0;
  const discount = course.original_price && course.price ? Math.round(((course.original_price - course.price) / course.original_price) * 100) : 0;
  const numericRating = Number(course.rating) || 0;

  const parseJsonSafe = (jsonString: any): any[] => {
    if (Array.isArray(jsonString)) return jsonString;
    if (typeof jsonString === 'string') {
      try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { return []; }
    }
    return [];
  };

  const objectivesArray = parseJsonSafe(course.objectives);
  const attachmentsArray = parseJsonSafe(course.attachments);
  const externalLinksArray = parseJsonSafe(course.external_links);

  const InfoBadge = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center gap-2 text-sm text-gray-200">
      <Icon className="h-4 w-4 text-gray-400" />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* --- Hero Section --- */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">{course.title}</h1>
            <p className="text-xl text-gray-300">{course.tagline}</p>
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-bold text-yellow-400 text-lg">{numericRating.toFixed(1)}</span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(numericRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`} />
                  ))}
                </div>
              </div>
              {typeof course.reviews_count === 'number' && <span className="text-gray-400">({course.reviews_count.toLocaleString()} ratings)</span>}
              {typeof course.enrolled_students_count === 'number' && <span className="text-gray-400">{course.enrolled_students_count.toLocaleString()} students</span>}
              {courseLevels.length > 0 && (
                <div className="flex items-center gap-2">
                  {courseLevels.map((lvl) => (
                    <Link key={lvl.id} href={`/levels/${lvl.id}`}>
                      <Badge variant="secondary">{lvl.name}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {course.instructor && (
              <div className="flex items-center gap-2 pt-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={course.instructor.image} alt={course.instructor.name} />
                      <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Created by <span className="font-semibold text-sky-400">{course.instructor.name}</span></span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              {course.last_updated && (
                <InfoBadge icon={Calendar} text={`Last updated ${new Date(course.last_updated).toLocaleDateString()}`} />
              )}
              <InfoBadge icon={Globe} text="English" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* --- Left Column --- */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="border-2 border-gray-100 shadow-none">
            <CardHeader><CardTitle>What you'll learn</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {objectivesArray.map((item: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 shadow-none">
            <CardHeader><CardTitle>Course content</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                <span>{course.curriculum.length} sections</span>
                <span>{lessonsCount} lessons</span>
                <span>{course.duration} total length</span>
              </div>
              {course.curriculum?.length > 0 ? (
                <Accordion type="single" collapsible className="w-full border rounded-lg">
                  {course.curriculum.map((section, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0">
                      <AccordionTrigger className="font-semibold text-base px-6 py-4 hover:bg-gray-50">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pt-0 pb-4">
                        <ul className="space-y-1">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-center justify-between py-2 text-sm">
                              <div className="flex items-center gap-3">
                                {lesson.is_preview ? <PlayCircle className="h-4 w-4 text-blue-500" /> : <ClipboardList className="h-4 w-4 text-gray-400" />}
                                <span className="text-gray-800">{lesson.title}</span>
                              </div>
                              <span className="text-gray-500">{lesson.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-center py-8 text-gray-500">Course content is not available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-100 shadow-none">
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent><p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.description}</p></CardContent>
          </Card>

          {course.instructor && (
            <Card className="border-2 border-gray-100 shadow-none">
              <CardHeader><CardTitle>About the Instructor</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Image src={course.instructor.image} alt={course.instructor.name} width={120} height={120} className="rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-sky-600">{course.instructor.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{course.instructor.title}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" /><span>{course.instructor.average_rating} Instructor Rating</span></div>
                      <div className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-gray-500" /><span>{course.instructor.reviews_count} Reviews</span></div>
                      <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-gray-500" /><span>{course.instructor.students_count} Students</span></div>
                      <div className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-gray-500" /><span>{course.instructor.courses_count} Courses</span></div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-gray-100 shadow-none">
            <CardHeader><CardTitle>Student Feedback</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl font-bold text-yellow-500">{numericRating.toFixed(1)}</div>
                <div>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`h-6 w-6 ${i < Math.round(numericRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 mt-1">Course Rating</p>
                </div>
              </div>
              <div className="space-y-6">
                {course.reviews?.map((review) => (
                  <div key={review.id} className="border-t pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.user_image} alt={review.user} />
                        <AvatarFallback>{review.user.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{review.user}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column (Sticky) --- */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="shadow-xl border-gray-200 overflow-hidden">
              <div className="relative aspect-video">
                {showVideo ? (
                  (() => {
                    const yt = getYouTubeEmbedUrl(course.demo_video_url);
                    return yt ? (
                      <iframe
                        src={yt}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Course demo video"
                      />
                    ) : (
                      <video
                        src={course.demo_video_url}
                        controls
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full"
                      />
                    );
                  })()
                ) : (
                  <>
                    <Image src={course.video_preview_image} alt={course.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        className="text-white h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        onClick={() => {
                        console.log('Playing video from URL:', course.demo_video_url);
                        setShowVideo(true);
                      }}
                      >
                        <PlayCircle className="h-16 w-16" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">₹{course.price.toLocaleString()}</span>
                  {course.original_price && course.price < course.original_price && (
                    <span className="text-xl text-gray-400 line-through">₹{course.original_price.toLocaleString()}</span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-lg font-semibold text-green-600">{discount}% off</p>
                )}
                <Button size="lg" className="w-full text-lg py-6 font-semibold">Add to Cart</Button>
                <Button size="lg" variant="outline" className="w-full text-lg py-6 font-semibold">Buy Now</Button>
                <p className="text-center text-xs text-gray-500">30-Day Money-Back Guarantee</p>
                <div className="pt-4 space-y-3 border-t">
                  <h4 className="font-semibold">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-gray-500" /><span>{course.duration} on-demand video</span></li>
                    <li className="flex items-center gap-3"><FileText className="h-4 w-4 text-gray-500" /><span>{attachmentsArray.length} articles & resources</span></li>
                    <li className="flex items-center gap-3"><Download className="h-4 w-4 text-gray-500" /><span>Downloadable resources</span></li>
                    <li className="flex items-center gap-3"><InfinityIcon className="h-4 w-4 text-gray-500" /><span>Full lifetime access</span></li>
                    <li className="flex items-center gap-3"><Award className="h-4 w-4 text-gray-500" /><span>Certificate of completion</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}