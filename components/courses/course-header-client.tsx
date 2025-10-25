"use client";

import { useEffect, useState } from "react";
import { BookOpen, Clock } from 'lucide-react';

interface Lesson { id: string; duration?: number; completed?: boolean }
interface Section { id: string; title: string; lessons: Lesson[] }

export default function CourseHeaderClient({ title, initialCurriculum }: { title: string; initialCurriculum: Section[] }) {
  const [curriculum, setCurriculum] = useState<Section[]>(initialCurriculum || []);

  useEffect(() => {
    const handler = (ev: any) => {
      const { lessonId, sectionId, completed } = ev.detail || {};
      if (!lessonId) return;
      setCurriculum(prev => prev.map(s => ({ ...s, lessons: s.lessons.map(l => l.id === lessonId ? { ...l, completed } : l) })));
    };
    window.addEventListener('lesson:completion-changed', handler);
    window.addEventListener('lesson:completion-confirmed', handler);
    return () => {
      window.removeEventListener('lesson:completion-changed', handler);
      window.removeEventListener('lesson:completion-confirmed', handler);
    };
  }, []);

  const allLessons = curriculum.flatMap(s => s.lessons || []);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(l => l.completed).length;
  const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const totalDuration = allLessons.reduce((acc, l) => acc + (Number(l.duration) || 0), 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-6 text-white shadow-2xl mb-6 overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"><BookOpen className="h-5 w-5" /></div>
              <span className="text-blue-100 font-semibold">Active Course</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            <p className="text-blue-100 text-sm">{completedLessons} of {totalLessons} complete</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="text-sm text-blue-100"><Clock className="inline-block mr-1" />{hours > 0 ? `${hours}h ` : ''}{minutes}m</div>
          </div>
        </div>
      </div>
    </div>
  );
}
