"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  completed?: boolean;
  lessonId: string;
  sectionId: string;
  courseId: string;
  role?: 'student' | 'trainer';
  studentId?: string;
  trainerId?: string;
  batchId?: string;
}

export default function CompletionToggle({ completed = false, lessonId, sectionId, courseId, role = 'student', studentId, trainerId, batchId }: Props) {
  const [isCompleted, setIsCompleted] = useState<boolean>(Boolean(completed));
  const [ownerRole, setOwnerRole] = useState<typeof role | undefined>(role);
  const [ownerStudentId, setOwnerStudentId] = useState<string | undefined>(studentId);
  const [ownerTrainerId, setOwnerTrainerId] = useState<string | undefined>(trainerId);
  const [ownerBatchId, setOwnerBatchId] = useState<string | undefined>(batchId);
  const toggled = !isCompleted;

  // Listen for resolved owner identifiers broadcast by sidebar wrapper
  useEffect(() => {
    const onResolved = (ev: any) => {
      const d = ev.detail || {};
      if (d.role) setOwnerRole(d.role);
      if (d.studentId) setOwnerStudentId(String(d.studentId));
      if (d.trainerId) setOwnerTrainerId(String(d.trainerId));
      if (d.batchId) setOwnerBatchId(String(d.batchId));
    };
    window.addEventListener('owner:resolved', onResolved as EventListener);
    return () => window.removeEventListener('owner:resolved', onResolved as EventListener);
  }, []);

  // Listen for programmatic toggle requests (e.g., Main "Next" button)
  useEffect(() => {
    const onRequest = (ev: any) => {
      const d = ev.detail || {};
      if (!d || !d.lessonId) return;
      if (String(d.lessonId) !== String(lessonId)) return;
      const toggledRemote = Boolean(d.completed);
      // Apply optimistic state and broadcast change so other components (sidebar/main) update.
      setIsCompleted(toggledRemote);
      try {
        const ev2 = new CustomEvent('lesson:completion-changed', { detail: { lessonId, sectionId, completed: toggledRemote } });
        window.dispatchEvent(ev2);
      } catch (e) {}
      // Attempt to persist here if owner identifiers are available (helps when main enqueued the change
      // or owner info is already present on this component). This ensures the programmatic Next flow
      // behaves like a manual click.
      (async () => {
        try {
          const useRole = ownerRole || role;
          const payload: any = {
            course_id: courseId,
            section_id: sectionId,
            lesson_id: lessonId,
            completed: toggledRemote,
            role: useRole,
          };
          if (useRole === 'student') {
            const sid = ownerStudentId || studentId;
            const bid = ownerBatchId || batchId;
            if (!sid || !bid) {
              // nothing to do; owner info not yet available
              return;
            }
            payload.student_id = sid;
            payload.batch_id = bid;
          } else {
            const trid = ownerTrainerId || trainerId;
            if (!trid) return;
            payload.trainer_id = trid;
          }

          // Try POSTing to the same endpoint as manual toggle
          const res = await fetch('/api/progress/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            try {
              const ev2 = new CustomEvent('lesson:completion-confirmed', { detail: { lessonId, sectionId, completed: toggledRemote } });
              window.dispatchEvent(ev2);
            } catch (e) {}
            // Remove any queued entry for this lesson (if main enqueued it)
            try {
              const key = `ai-skool:pendingCompletions:${String(courseId)}`;
              const raw = localStorage.getItem(key) || '[]';
              const arr: string[] = JSON.parse(raw || '[]');
              const updated = arr.filter(x => x !== String(lessonId));
              localStorage.setItem(key, JSON.stringify(updated));
            } catch (e) {}
          }
        } catch (e) {
          // ignore; main client will have queued/persist logic
        }
      })();
    };
    window.addEventListener('lesson:request-toggle', onRequest as EventListener);
    return () => window.removeEventListener('lesson:request-toggle', onRequest as EventListener);
  }, [lessonId, sectionId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic UI
    setIsCompleted(toggled);

    // Broadcast optimistic update so other client components can react
    try {
      const ev = new CustomEvent('lesson:completion-changed', { detail: { lessonId, sectionId, completed: toggled } });
      window.dispatchEvent(ev);
    } catch (e) {}

    const payload: any = {
      course_id: courseId,
      section_id: sectionId,
      lesson_id: lessonId,
      completed: toggled,
      role: ownerRole || role,
    };
    const useRole = ownerRole || role;
    if (useRole === 'student') {
      const sid = ownerStudentId || studentId;
      const bid = ownerBatchId || batchId;
      if (sid) payload.student_id = sid;
      if (bid) payload.batch_id = bid;
    } else {
      const trid = ownerTrainerId || trainerId;
      if (trid) payload.trainer_id = trid;
    }

    try {
      await fetch('/api/progress/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // confirm event after server success
      try {
        const ev2 = new CustomEvent('lesson:completion-confirmed', { detail: { lessonId, sectionId, completed: toggled } });
        window.dispatchEvent(ev2);
      } catch (e) {}
    } catch (err) {
      // revert on error
      setIsCompleted(!toggled);
      try {
        const ev3 = new CustomEvent('lesson:completion-changed', { detail: { lessonId, sectionId, completed: !toggled } });
        window.dispatchEvent(ev3);
      } catch (e) {}
    }
  };

  return (
    <button onClick={handleClick} className="flex-shrink-0 ml-auto p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-pressed={isCompleted}>
      <CheckCircle className={`w-5 h-5 transition-colors ${isCompleted ? 'text-green-500 fill-current' : 'text-gray-400 hover:text-green-500'}`} />
    </button>
  );
}
