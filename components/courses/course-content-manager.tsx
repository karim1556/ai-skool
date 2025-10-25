"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, GripVertical, Trash2, Pencil, ArrowUpDown, BookOpen, ClipboardCheck, Video, User, AlertCircle, Loader2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AddSectionModal } from "./add-section-modal";
import { AddLessonModal } from './add-lesson-modal';
import { AddQuizModal } from './add-quiz-modal';
import { AddAssignmentModal } from './add-assignment-modal';
import { ManageQuizQuestionsModal } from './manage-quiz-questions-modal';
import { SortSectionsModal } from "./sort-sections-modal";
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from './strict-mode-droppable';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Enhanced Type Definitions
interface ContentItem {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  duration?: string;
  is_published?: boolean;
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
  const [success, setSuccess] = useState<string | null>(null);

  // Modal states
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showSortSections, setShowSortSections] = useState(false);
  const [isManageQuestionsModalOpen, setManageQuestionsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [dragLoading, setDragLoading] = useState<string | null>(null);

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sectionId = source.droppableId;
    if (source.droppableId !== destination.droppableId) {
      return;
    }

    const items = Array.from(content[sectionId] || []);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    const originalContent = { ...content };
    setContent(prev => ({ ...prev, [sectionId]: items }));
    setDragLoading(sectionId);

    const updatedOrder = items.map((item, index) => ({
      id: item.id,
      type: item.type,
      sort_order: index,
    }));

    try {
      const response = await fetch('/api/content/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedOrder }),
      });

      if (!response.ok) {
        throw new Error('Failed to save sorted order');
      }
      showSuccess('Content order updated successfully!');
    } catch (error) {
      console.error('Error saving sort order:', error);
      setContent(originalContent);
      setError('Failed to update content order');
    } finally {
      setDragLoading(null);
    }
  };

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
    showSuccess('Assignment updated successfully!');
  };

  const handleUpdateQuiz = (updatedQuiz: any) => {
    refreshContentForSection(updatedQuiz.section_id);
    setShowAddQuiz(false);
    setEditingQuiz(null);
    showSuccess('Quiz updated successfully!');
  };

  const handleUpdateLesson = (updatedLesson: any) => {
    refreshContentForSection(updatedLesson.section_id);
    setShowAddLesson(false);
    setEditingLesson(null);
    showSuccess('Lesson updated successfully!');
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

      const courseRes = await fetch(`/api/courses/${course.id}/details`);
      if (!courseRes.ok) throw new Error('Failed to refresh course data');
      const updatedCourse = await courseRes.json();
      setSections(updatedCourse.curriculum);

      setShowAddSection(false);
      setEditingSection(null);
      showSuccess('Section updated successfully!');
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
    showSuccess('Section added successfully!');
  };

  const handleSortSections = async (sortedSections: any[]) => {
    // Persist the new ordering to the server by updating each section's sort_order
    try {
      setLoading(true);
      const promises = sortedSections.map((section: any, index: number) => {
        return fetch(`/api/sections/${section.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: index })
        }).then(async (res) => {
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to update section order');
          }
          return res.json();
        });
      });

      const results = await Promise.all(promises);
      // After successful persistence, update UI state with the updated sections
  // Normalize backend `sort_order` into `order` field used in the UI
  setSections(results.map((r: any) => ({ ...r, order: (r.sort_order ?? r.order ?? 0) })));
      showSuccess('Sections reordered successfully!');
    } catch (err: any) {
      console.error('Failed to persist section order', err);
      setError(err.message || 'Failed to save section order');
    } finally {
      setLoading(false);
    }
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

      const courseRes = await fetch(`/api/courses/${course.id}/details`);
      if (!courseRes.ok) throw new Error('Failed to refresh course data');
      const updatedCourse = await courseRes.json();
      setSections(updatedCourse.curriculum);
      showSuccess('Section deleted successfully!');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInstructorChange = async (instructorId: string) => {
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructor_id: instructorId }),
      });

      if (!res.ok) throw new Error('Failed to update instructor');

      const updatedCourse = await res.json();
      setCourse(updatedCourse);
      showSuccess('Instructor updated successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (itemId: string, itemType: string, sectionId: string) => {
    if (!confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
      return;
    }

    const apiPath = itemType === 'lesson' ? 'lessons' : itemType === 'quiz' ? 'quizzes' : 'assignments';

    try {
      const res = await fetch(`/api/${apiPath}/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to delete ${itemType}`);
      }

      await refreshContentForSection(sectionId);
      showSuccess(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully!`);

    } catch (err: any) {
      setError(err.message);
    }
  };

  const getContentStats = () => {
    const totalLessons = Object.values(content).flat().filter(item => item.type === 'lesson').length;
    const totalQuizzes = Object.values(content).flat().filter(item => item.type === 'quiz').length;
    const totalAssignments = Object.values(content).flat().filter(item => item.type === 'assignment').length;
    return { totalLessons, totalQuizzes, totalAssignments };
  };

  const stats = getContentStats();

  const renderContentItem = (item: ContentItem, sectionId: string) => {
    const icons = {
      lesson: <Video className="h-4 w-4 text-blue-500" />,
      quiz: <BookOpen className="h-4 w-4 text-green-500" />,
      assignment: <ClipboardCheck className="h-4 w-4 text-purple-500" />
    };

    const typeColors = {
      lesson: 'bg-blue-50 text-blue-700 border-blue-200',
      quiz: 'bg-green-50 text-green-700 border-green-200',
      assignment: 'bg-purple-50 text-purple-700 border-purple-200'
    };

    return (
      <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
          {icons[item.type]}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-xs ${typeColors[item.type]}`}>
                {item.type}
              </Badge>
              {item.duration && (
                <span className="text-xs text-gray-500">{item.duration}</span>
              )}
              {item.is_published !== undefined && (
                <Badge variant={item.is_published ? "default" : "secondary"} className="text-xs">
                  {item.is_published ? 'Published' : 'Draft'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.type === 'quiz' && (
            <Button variant="outline" size="sm" onClick={() => {
              setSelectedQuiz({ id: item.id, title: item.title });
              setManageQuestionsModalOpen(true);
            }}>
              Manage Questions
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                if (item.type === 'lesson') handleEditLesson(item);
                if (item.type === 'quiz') handleEditQuiz(item);
                if (item.type === 'assignment') handleEditAssignment(item);
              }}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteItem(item.id, item.type, sectionId)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  const SectionSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Status Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Instructor Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Course Instructor
          </CardTitle>
          <CardDescription>
            Assign or change the primary instructor for this course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.instructor ? (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={course.instructor.image || '/images/default-avatar.png'}
                alt={course.instructor.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <p className="font-semibold text-lg">{course.instructor.full_name}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                Current Instructor
              </Badge>
            </div>
          ) : (
            <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No instructor assigned</p>
              <p className="text-sm text-gray-400 mt-1">Select an instructor below to assign them to this course</p>
            </div>
          )}
          <div className="max-w-md">
            <Label htmlFor="instructor-select" className="text-sm font-medium">
              Change Instructor
            </Label>
            <Select onValueChange={handleInstructorChange} defaultValue={course.instructor?.id}>
              <SelectTrigger id="instructor-select" className="mt-1">
                <SelectValue placeholder="Select an instructor..." />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    <div className="flex items-center gap-2">
                      <img
                        src={inst.image || '/images/default-avatar.png'}
                        alt={inst.full_name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{inst.full_name}</span>
                      {inst.title && (
                        <span className="text-xs text-gray-500 ml-auto">{inst.title}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Management Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Course Curriculum
              </CardTitle>
              <CardDescription>
                Manage sections, lessons, quizzes, and assignments for your course
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="outline">{stats.totalLessons} Lessons</Badge>
              <Badge variant="outline">{stats.totalQuizzes} Quizzes</Badge>
              <Badge variant="outline">{stats.totalAssignments} Assignments</Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={() => setShowAddSection(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
            <Button variant="outline" onClick={() => setShowAddLesson(true)} className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Add Lesson
            </Button>
            <Button variant="outline" onClick={() => setShowAddQuiz(true)} className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Add Quiz
            </Button>
            <Button variant="outline" onClick={() => setShowAddAssignment(true)} className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Add Assignment
            </Button>
            <Button variant="outline" onClick={() => setShowSortSections(true)} className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort Sections
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <SectionSkeleton />
              <SectionSkeleton />
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sections Created</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Start building your course curriculum by creating your first section. 
                Sections help organize your content into logical groups.
              </p>
              <Button onClick={() => setShowAddSection(true)} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Create First Section
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Accordion type="multiple" className="w-full space-y-4">
                {sections.sort((a, b) => a.order - b.order).map((section) => (
                  <AccordionItem value={section.id} key={section.id} className="border rounded-lg bg-white">
                    <AccordionTrigger className="hover:no-underline px-6 py-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                          <div className="text-left">
                            <span className="font-semibold text-lg">{section.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {(content[section.id] || []).length} items
                              </Badge>
                              {dragLoading === section.id && (
                                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditSection(section)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Section
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteSection(section.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Section
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <Droppable droppableId={section.id} key={section.id}>
                      {(provided) => (
                        <AccordionContent
                          className="px-6 pb-4 space-y-3"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {(content[section.id] || []).length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                              <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">No content in this section yet</p>
                              <p className="text-sm text-gray-400 mt-1">Add lessons, quizzes, or assignments to get started</p>
                            </div>
                          ) : (
                            (content[section.id] || []).map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {renderContentItem(item, section.id)}
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </AccordionContent>
                      )}
                    </Droppable>
                  </AccordionItem>
                ))}
              </Accordion>
            </DragDropContext>
          )}
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
      {isManageQuestionsModalOpen && <ManageQuizQuestionsModal isOpen={isManageQuestionsModalOpen} onClose={() => setManageQuestionsModalOpen(false)} quiz={selectedQuiz} />}
      <SortSectionsModal isOpen={showSortSections} onClose={() => setShowSortSections(false)} sections={sections} onSort={handleSortSections} />
    </div>
  );
};