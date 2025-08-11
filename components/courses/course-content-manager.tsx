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
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);

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

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setShowAddSection(true);
  };

  const handleEditLesson = async (lesson: ContentItem) => {
    try {
      // Fetch full lesson details to pass to the modal
      const res = await fetch(`/api/lessons/${lesson.id}`);
      if (!res.ok) throw new Error('Failed to fetch lesson details');
      const fullLessonDetails = await res.json();
      setEditingLesson(fullLessonDetails);
      setShowAddLesson(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditQuiz = async (quiz: ContentItem) => {
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}`);
      if (!res.ok) throw new Error('Failed to fetch quiz details');
      const fullQuizDetails = await res.json();
      setEditingQuiz(fullQuizDetails);
      setShowAddQuiz(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditAssignment = async (assignment: ContentItem) => {
    try {
      const res = await fetch(`/api/assignments/${assignment.id}`);
      if (!res.ok) throw new Error('Failed to fetch assignment details');
      const fullAssignmentDetails = await res.json();
      setEditingAssignment(fullAssignmentDetails);
      setShowAddAssignment(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateAssignment = (updatedAssignment: any) => {
    refreshContentForSection(updatedAssignment.section_id);
    setShowAddAssignment(false);
    setEditingAssignment(null);
  };

  const handleUpdateQuiz = (updatedQuiz: any) => {
    refreshContentForSection(updatedQuiz.section_id);
    setShowAddQuiz(false);
    setEditingQuiz(null);
  };

  const handleUpdateLesson = (updatedLesson: any) => {
    // The modal handles the API call, we just need to refresh the UI
    refreshContentForSection(updatedLesson.section_id);
    setShowAddLesson(false);
    setEditingLesson(null);
  };

  const handleUpdateSection = async (sectionId: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update section');
      }

      // Refresh sections to show the updated title
      const courseRes = await fetch(`/api/courses/${course.id}/details`);
      if (!courseRes.ok) throw new Error('Failed to refresh course data');
      const updatedCourse = await courseRes.json();
      setSections(updatedCourse.curriculum);

      setShowAddSection(false);
      setEditingSection(null);
    } catch (err: any) {
      setError(err.message);
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
    // Placeholder for API call to update section order
    setSections(sortedSections);
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section and all its contents? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete section');
      }

      // Refetch all sections for the course to update the UI
      const courseRes = await fetch(`/api/courses/${course.id}/details`);
      if (!courseRes.ok) throw new Error('Failed to refresh course data');
      const updatedCourse = await courseRes.json();
      setSections(updatedCourse.curriculum);

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInstructorChange = async (instructorId: string) => {
    // Logic to update instructor remains the same
  };



  const handleDeleteItem = async (itemId: string, itemType: string, sectionId: string) => {
    if (!confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
      return;
    }

    // This assumes a consistent API structure, e.g., /api/lessons/:id, /api/quizzes/:id, /api/assignments/:id
    // We will need to create the other endpoints. For now, this works for lessons.
    const apiPath = itemType === 'lesson' ? 'lessons' : itemType === 'quiz' ? 'quizzes' : 'assignments';

    try {
      const res = await fetch(`/api/${apiPath}/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to delete ${itemType}`);
      }

      // Refresh the content for the affected section to show the change
      await refreshContentForSection(sectionId);

    } catch (err: any) {
      setError(err.message);
      // Optionally, show a toast notification for the error
    }
  };

  const renderContentItem = (item: ContentItem, sectionId: string) => {
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
          <Button variant="ghost" size="icon" onClick={() => {
            if (item.type === 'lesson') handleEditLesson(item);
            if (item.type === 'quiz') handleEditQuiz(item);
            if (item.type === 'assignment') handleEditAssignment(item);
          }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id, item.type, sectionId)}>
            <Trash2 className="h-4 w-4" />
          </Button>
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
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEditSection(section); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-8 space-y-2">
                  {content[section.id] ? content[section.id].map(item => renderContentItem(item, section.id)) : <p>No content for this section.</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddSectionModal
        isOpen={showAddSection}
        onClose={() => {
          setShowAddSection(false);
          setEditingSection(null);
        }}
        onAdd={handleAddSection}
        onEdit={handleUpdateSection}
        sectionToEdit={editingSection}
      />
      <AddLessonModal
        isOpen={showAddLesson}
        onClose={() => {
          setShowAddLesson(false);
          setEditingLesson(null);
        }}
        onAdd={(newLesson) => refreshContentForSection(newLesson.section_id)}
        onEdit={handleUpdateLesson}
        lessonToEdit={editingLesson}
        sections={sections}
        courseTitle={course.title}
      />
      <AddQuizModal
        isOpen={showAddQuiz}
        onClose={() => {
          setShowAddQuiz(false);
          setEditingQuiz(null);
        }}
        sections={sections}
        onAdd={(data) => refreshContentForSection(data.section_id)}
        onEdit={handleUpdateQuiz}
        quizToEdit={editingQuiz}
      />
      <AddAssignmentModal
        isOpen={showAddAssignment}
        onClose={() => {
          setShowAddAssignment(false);
          setEditingAssignment(null);
        }}
        sections={sections}
        onAdd={(data) => refreshContentForSection(data.section_id)}
        onEdit={handleUpdateAssignment}
        assignmentToEdit={editingAssignment}
      />
      <SortSectionsModal isOpen={showSortSections} onClose={() => setShowSortSections(false)} sections={sections} onSort={handleSortSections} />
    </div>
  );
}
