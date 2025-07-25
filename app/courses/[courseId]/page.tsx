"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import {
  Star,
  Clock,
  BookOpen,
  Users,
  Calendar,
  Globe,
  BarChart2,
  ShoppingCart,
  PlayCircle,
  Check,
  MessageSquare,
  FileText,
  LinkIcon,
  Download,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define a type for the course object for type safety
interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  whatYouWillLearn: string[];
  instructor: {
    name: string;
    title: string;
    bio: string;
    image: string;
    courses: number;
    students: string;
    rating: number;
    reviews: number;
  };
  rating: number;
  reviewsCount: number;
  studentsEnrolled: string;
  price: number;
  originalPrice: number;
  discount: string;
  lessonsCount: number;
  duration: string;
  language: string;
  level: string;
  lastUpdated: string;
  videoPreview: string;
  videoUrl: string;
  curriculum: {
    title: string;
    lessons: { title: string; duration: string }[];
  }[];
  attachments: { name: string; url: string }[];
  externalLinks: { name: string; url: string }[];
  reviews: {
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseId}/details`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading course...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!course) {
    return <div className="flex justify-center items-center h-screen">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-4xl md:text-5xl font-black leading-tight">{course.title}</h1>
              <p className="text-xl text-gray-300">{course.tagline}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <span className="font-bold text-yellow-400 mr-1">{course.rating}</span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-400">({course.reviewsCount} ratings)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-gray-400">{course.studentsEnrolled} students</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated: {course.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>Language: {course.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span>Level: {course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          {/* What you'll learn */}
          <Card className="p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouWillLearn?.map((item, index) => (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
              <Accordion type="multiple" className="w-full">
                {course.curriculum?.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} value={`item-${moduleIndex}`}>
                    <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center justify-between text-gray-600 text-sm">
                            <div className="flex items-center space-x-2">
                              <PlayCircle className="h-4 w-4 text-gray-500" />
                              <span>{lesson.title}</span>
                            </div>
                            <span>{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.description}</p>
            </CardContent>
          </Card>

          {/* Course Resources (Attachments) */}
          {course.attachments && course.attachments.length > 0 && (
            <Card className="p-6 shadow-sm">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Resources</h2>
                <ul className="space-y-3">
                  {course.attachments?.map((attachment, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">{attachment.name}</span>
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
          {course.externalLinks && course.externalLinks.length > 0 && (
            <Card className="p-6 shadow-sm">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Useful Links</h2>
                <ul className="space-y-3">
                  {course.externalLinks?.map((link, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <LinkIcon className="h-5 w-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">{link.name}</span>
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
                  <span>{course.instructor.courses} Courses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.instructor.students} Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.instructor.rating} Instructor Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{course.instructor.reviews} Reviews</span>
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
                {course.reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {review.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{review.user}</p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
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
                  poster={course.videoPreview || "/placeholder.svg"}
                  className="w-full h-auto object-cover rounded-t-lg"
                >
                  <source src={course.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-pink-600">₹{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">₹{course.originalPrice}</span>
                    )}
                  </div>
                  {course.discount && (
                    <Badge className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {course.discount}
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
                    <span>{course.lessonsCount} lessons</span>
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
  )
} 