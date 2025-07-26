"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, GripVertical, Trash2, Pencil, ArrowUpDown, BookOpen, ClipboardCheck, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AddSectionModal } from "./add-section-modal";
import { AddLessonModal } from "./add-lesson-modal";
import { AddQuizModal } from "./add-quiz-modal";
import { AddAssignmentModal } from "./add-assignment-modal";
import { SortSectionsModal } from "./sort-sections-modal";

// Enhanced Type Definitions
interface ContentItem {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  duration?: string;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: ContentItem[];
  quizzes: ContentItem[];
  assignments: ContentItem[];
}

interface Instructor {
  id: string;
  full_name: string;
  image?: string;
  title?: string;
}

interface CourseDetails {
  id: string;
  title: string;
  curriculum: Section[];
  instructor?: Instructor | null;
}

interface CourseContentManagerProps {
  course: CourseDetails;
  instructors: Instructor[];
}

export const CourseContentManager = ({ course: initialCourse, instructors }: CourseContentManagerProps) => {
  const [course, setCourse] = useState(initialCourse);
  const [sections, setSections] = useState<Section[]>(initialCourse.curriculum);
  const [content, setContent] = useState<Record<string, ContentItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showSortSections, setShowSortSections] = useState(false);

  // Fetch content for all sections on mount
  useEffect(() => {
    const fetchAllContent = async () => {
      if (!sections.length) return;
      setLoading(true);
      const allContent: Record<string, ContentItem[]> = {};
      for (const section of sections) {
        try {
          const [lessonsRes, quizzesRes, assignmentsRes] = await Promise.all([
            fetch(`/api/sections/${section.id}/lessons`),
            fetch(`/api/sections/${section.id}/quizzes`),
            fetch(`/api/sections/${section.id}/assignments`),
          ]);
          const lessons = lessonsRes.ok ? await lessonsRes.json() : [];
          const quizzes = quizzesRes.ok ? await quizzesRes.json() : [];
          const assignments = assignmentsRes.ok ? await assignmentsRes.json() : [];
          allContent[section.id] = [
            ...lessons.map((l: any) => ({ ...l, type: 'lesson' })),
            ...quizzes.map((q: any) => ({ ...q, type: 'quiz' })),
            ...assignments.map((a: any) => ({ ...a, type: 'assignment' }))
          ];
        } catch (err) {
          console.error(`Failed to fetch content for section ${section.id}`, err);
          allContent[section.id] = [];
        }
      }
      setContent(allContent);
      setLoading(false);
    };
    fetchAllContent();
  }, [sections]);

  const refreshContentForSection = async (sectionId: string) => {
    // This function can be called after adding new content
    try {
      const [lessonsRes, quizzesRes, assignmentsRes] = await Promise.all([
        fetch(`/api/sections/${sectionId}/lessons`),
        fetch(`/api/sections/${sectionId}/quizzes`),
        fetch(`/api/sections/${sectionId}/assignments`),
      ]);
      const lessons = lessonsRes.ok ? await lessonsRes.json() : [];
      const quizzes = quizzesRes.ok ? await quizzesRes.json() : [];
      const assignments = assignmentsRes.ok ? await assignmentsRes.json() : [];
      setContent(prev => ({
        ...prev,
        [sectionId]: [
          ...lessons.map((l: any) => ({ ...l, type: 'lesson' })),
          ...quizzes.map((q: any) => ({ ...q, type: 'quiz' })),
          ...assignments.map((a: any) => ({ ...a, type: 'assignment' }))
        ]
      }));
    } catch (err) {
      console.error(`Failed to refresh content for section ${sectionId}`, err);
    }
  };

  const handleAddSection = async (title: string) => {
    const res = await fetch(`/api/courses/${course.id}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const newSection = await res.json();
    setSections([...sections, newSection]);
  };

  const handleSortSections = async (sortedSections: any[]) => {
    setSections(sortedSections);
    await fetch(`/api/courses/${course.id}/sections/sort`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: sortedSections }),
    });
  };

  const handleInstructorChange = async (instructorId: string) => {
    // Logic to update instructor remains the same
  };

  const renderContentItem = (item: ContentItem) => {
    const icons = {
      lesson: <Video className="h-4 w-4 text-blue-500" />,
      quiz: <BookOpen className="h-4 w-4 text-green-500" />,
      assignment: <ClipboardCheck className="h-4 w-4 text-purple-500" />
    }
    return (
      <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-3 bg-white rounded border">
        <div className="flex items-center gap-3">
          {icons[item.type]}
          <span>{item.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Instructor Card ... remains the same */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.instructor ? (
            <div className="flex items-center space-x-4">
              <img
                src={course.instructor.image || '/images/default-avatar.png'}
                alt={course.instructor.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{course.instructor.full_name}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
              </div>
            </div>
          ) : (
            <p>No instructor assigned.</p>
          )}
          <div>
            <Label htmlFor="instructor-select">Change Instructor</Label>
            <Select onValueChange={handleInstructorChange} defaultValue={course.instructor?.id}>
              <SelectTrigger id="instructor-select">
                <SelectValue placeholder="Select an instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Curriculum</CardTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddSection(true)}><Plus className="h-4 w-4 mr-2" /> Add Section</Button>
            <Button variant="outline" onClick={() => setShowAddLesson(true)}><Plus className="h-4 w-4 mr-2" /> Add Lesson</Button>
            <Button variant="outline" onClick={() => setShowAddQuiz(true)}><Plus className="h-4 w-4 mr-2" /> Add Quiz</Button>
            <Button variant="outline" onClick={() => setShowAddAssignment(true)}><Plus className="h-4 w-4 mr-2" /> Add Assignment</Button>
            <Button variant="outline" onClick={() => setShowSortSections(true)}><ArrowUpDown className="h-4 w-4 mr-2" /> Sort Sections</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading content...</p>}
          <Accordion type="multiple" className="w-full">
            {sections.sort((a, b) => a.order - b.order).map((section) => (
              <AccordionItem value={section.id} key={section.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2 w-full">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-8 space-y-2">
                  {content[section.id] ? content[section.id].map(renderContentItem) : <p>No content for this section.</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddSectionModal isOpen={showAddSection} onClose={() => setShowAddSection(false)} onAdd={handleAddSection} />
      <AddLessonModal
        isOpen={showAddLesson}
        onClose={() => setShowAddLesson(false)}
        onAdd={(newLesson) => {
          // Add to the correct section in the UI
          refreshContentForSection(newLesson.section_id);
        }}
        sections={sections}
        courseTitle={course.title}
      />
      <AddQuizModal isOpen={showAddQuiz} onClose={() => setShowAddQuiz(false)} sections={sections} onAdd={(data) => refreshContentForSection(data.section_id)} />
      <AddAssignmentModal isOpen={showAddAssignment} onClose={() => setShowAddAssignment(false)} sections={sections} onAdd={(data) => refreshContentForSection(data.section_id)} />
      <SortSectionsModal isOpen={showSortSections} onClose={() => setShowSortSections(false)} sections={sections} onSort={handleSortSections} />
    </div>
  );
}
