"use client";

import { useEffect, useState } from "react";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import CourseSidebarClient from "./course-sidebar-client";

interface Section { id: string; title: string; lessons: any[] }

export default function CourseSidebarWrapper({ initialCurriculum, courseId }: { initialCurriculum: Section[]; courseId: string }) {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  const [resolved, setResolved] = useState<{ role?: 'student'|'trainer'; studentId?: string; batchId?: string; trainerId?: string } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Default to no identifiers until we resolve the current user
        if (!authLoaded || !userLoaded) return;
        if (!isSignedIn || !user) return;

        // Fetch course levels to determine assignment membership
        let courseLevels: any[] = [];
        try {
          const lvRes = await fetch(`/api/courses/${encodeURIComponent(courseId)}/levels`, { cache: 'no-store' });
          if (lvRes.ok) courseLevels = await lvRes.json();
        } catch (e) {}

        const courseLevelIds = new Set((courseLevels || []).map((l:any) => Number(l.id)));

        // Try student path: look up batch enrolments for this Clerk user
        try {
          const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${encodeURIComponent(user.id)}`, { cache: 'no-store' });
          if (enrRes.ok) {
            const enrolments = await enrRes.json();
            if (Array.isArray(enrolments) && enrolments.length > 0) {
              // Map batches -> student id
              const batchIds: string[] = [...new Set(enrolments.map((e:any) => e.batch_id).filter(Boolean))];
              const batchToStudent = new Map<string, string>();
              for (const e of enrolments) {
                if (e.batch_id && e.student_id) batchToStudent.set(String(e.batch_id), String(e.student_id));
              }

              for (const bid of batchIds) {
                try {
                  const blRes = await fetch(`/api/batches/${bid}/levels`, { cache: 'no-store' });
                  if (!blRes.ok) continue;
                  const bl = await blRes.json();
                  if (Array.isArray(bl) && bl.some((l:any) => courseLevelIds.has(Number(l.id)))) {
                    if (!active) return;
                    setResolved({ role: 'student', studentId: batchToStudent.get(String(bid)) || undefined, batchId: String(bid) });
                    return;
                  }
                } catch {}
              }
            }
          }
        } catch (e) {}

        // Try trainer path
        try {
          // sync and resolve school
          try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }); } catch {}
          const schoolRes = await fetch('/api/me/school', { cache: 'no-store' });
          const school = schoolRes.ok ? await schoolRes.json() : null;
          const sid = school?.schoolId;
          if (sid) {
            const trRes = await fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' });
            if (trRes.ok) {
              const tr = await trRes.json();
              if (Array.isArray(tr)) {
                const myEmail = (user?.primaryEmailAddress?.emailAddress || '').toLowerCase();
                const mine = tr.find((t:any) => (t.email || '').toLowerCase() === myEmail);
                if (mine?.id) {
                  const lvRes = await fetch(`/api/trainers/${mine.id}/levels`, { cache: 'no-store' });
                  if (lvRes.ok) {
                    const lv = await lvRes.json();
                    if (Array.isArray(lv) && lv.some((l:any) => courseLevelIds.has(Number(l.id)))) {
                      if (!active) return;
                      setResolved({ role: 'trainer', trainerId: String(mine.id) });
                      return;
                    }
                  }
                }
              }
            }
          }
        } catch (e) {}

        // If nothing matched, leave as null
        if (active) setResolved(null);
      } catch (e) {
        if (active) setResolved(null);
      }
    })();
    return () => { active = false };
  }, [authLoaded, userLoaded, isSignedIn, user?.id, courseId]);

  // Broadcast resolved owner identifiers so other client components (toggles, main) can pick them up
  useEffect(() => {
    try {
      if (resolved) {
        setTimeout(() => {
          try {
            window.dispatchEvent(new CustomEvent('owner:resolved', { detail: { ...resolved } }));
          } catch (e) {}
        }, 10);
      }
    } catch (e) {}
  }, [resolved]);

  // While resolving show the sidebar without persisted completions (it will hydrate once resolved)
  return (
    <CourseSidebarClient initialCurriculum={initialCurriculum} courseId={courseId} role={resolved?.role as any} studentId={resolved?.studentId} batchId={resolved?.batchId} trainerId={resolved?.trainerId} />
  );
}
