"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, GripVertical, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Type Definitions
interface Lesson {
  id: string;
  title: string;
  duration: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
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
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingLessonToSection, setAddingLessonToSection] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInstructorChange = async (instructorId: string) => {
    if (!instructorId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/courses/${course.id}/instructor`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId }),
      });
      if (!response.ok) throw new Error('Failed to update instructor');
      const updatedInstructor = await response.json();
      setCourse(prevCourse => ({ ...prevCourse!, instructor: updatedInstructor }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/courses/${course.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSectionTitle }),
      });
      if (!response.ok) throw new Error('Failed to add section');
      const newSection = await response.json();
      newSection.lessons = [];
      setCourse(prevCourse => ({
        ...prevCourse!,
        curriculum: [...prevCourse!.curriculum, newSection],
      }));
      setNewSectionTitle("");
      setIsAddingSection(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonDuration.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/sections/${sectionId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newLessonTitle, duration: newLessonDuration }),
      });
      if (!response.ok) throw new Error('Failed to add lesson');
      const newLesson = await response.json();
      setCourse(prevCourse => ({
        ...prevCourse!,
        curriculum: prevCourse!.curriculum.map(section =>
          section.id === sectionId
            ? { ...section, lessons: [...section.lessons, newLesson] }
            : section
        ),
      }));
      setNewLessonTitle("");
      setNewLessonDuration("");
      setAddingLessonToSection(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Curriculum</CardTitle>
            <p className="text-sm text-gray-500">Add, edit, and reorder sections and lessons.</p>
          </div>
          {!isAddingSection && (
            <Button onClick={() => setIsAddingSection(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isAddingSection && (
            <form onSubmit={handleAddSection} className="flex items-center space-x-2 mb-4 p-4 bg-slate-100 rounded-md">
              <Input
                placeholder="Enter new section title"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Save Section'}</Button>
              <Button type="button" variant="ghost" onClick={() => setIsAddingSection(false)}>Cancel</Button>
            </form>
          )}

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <Accordion type="multiple" className="w-full">
            {course.curriculum.map((section) => (
              <AccordionItem value={section.id} key={section.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2 w-full">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <span className="font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-8">
                  <ul className="space-y-2">
                    {section.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span>{lesson.title}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {addingLessonToSection === section.id ? (
                    <form onSubmit={(e) => handleAddLesson(e, section.id)} className="mt-4 p-4 bg-slate-100 rounded-md space-y-2">
                      <Input
                        placeholder="Lesson title"
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                      />
                      <Input
                        placeholder="Lesson duration (e.g., 10:32)"
                        value={newLessonDuration}
                        onChange={(e) => setNewLessonDuration(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="ghost" onClick={() => setAddingLessonToSection(null)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Lesson'}</Button>
                      </div>
                    </form>
                  ) : (
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setAddingLessonToSection(section.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseContentManager;
