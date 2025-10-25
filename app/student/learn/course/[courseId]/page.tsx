"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseHeaderClient from '@/components/courses/course-header-client';
import CourseSidebarClient from '@/components/courses/course-sidebar-client';
import CourseMainClient from '@/components/courses/course-main-client';

interface ApiLesson {
  id: string | number;
  title: string;
  type?: string;
  duration?: number | string;
  content?: string;
  video_url?: string;
  url?: string; // sometimes used
}

interface ApiSection {
  id: string | number;
  title: string;
  lessons: ApiLesson[];
}

interface ApiCourse {
  id: string | number;
  title: string;
  overview?: string;
  description?: string;
  curriculum: ApiSection[];
}

export default function StudentCoursePlaybackPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = String(courseId);
  const router = useRouter();

  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [courseLevels, setCourseLevels] = useState<any[]>([]);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  // Load course meta and its levels
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [cRes, lvRes] = await Promise.all([
          fetch(`/api/courses/${id}/details`, { cache: 'no-store' }),
          fetch(`/api/courses/${id}/levels`, { cache: 'no-store' })
        ]);
        const c = await cRes.json();
        const lv = await lvRes.json();
        if (!active) return;
        setCourse(cRes.ok ? c : null);
        setCourseLevels(Array.isArray(lv) ? lv : []);
      } catch (e:any) {
        if (active) setError('Failed to load course');
      }
    })();
    return () => { active = false };
  }, [id]);

  // Guard: only students assigned the course via a level can pass
  useEffect(() => {
    let active = true;
    (async () => {
      if (!authLoaded || !userLoaded) return;
      if (!isSignedIn) { if (active){ setAuthorized(false); setLoading(false);} return; }
      try {
        setLoading(true);
        setError(null);
        const courseLevelIds = new Set((courseLevels || []).map((l:any) => Number(l.id)));

        // get batches for this student
        const enrRes = await fetch(`/api/batch-enrolments?studentClerkId=${encodeURIComponent(user?.id || '')}`, { cache: 'no-store' });
        const enrolments = await enrRes.json();
        if (!enrRes.ok) throw new Error(enrolments?.error || 'Failed to load enrolments');
        const enrols = Array.isArray(enrolments) ? enrolments : [];
        const batchIds: string[] = [...new Set(enrols.map((e:any) => e.batch_id).filter(Boolean))];
        const batchToStudent = new Map<string, string>();
        for (const e of enrols) {
          if (e.batch_id && e.student_id) batchToStudent.set(String(e.batch_id), String(e.student_id));
        }

        let allowed = false; let chosenBatch: string | null = null;
        for (const bid of batchIds) {
          try {
            const blRes = await fetch(`/api/batches/${bid}/levels`, { cache: 'no-store' });
            const bl = await blRes.json();
            if (blRes.ok && Array.isArray(bl)) {
              if (bl.some((l:any) => courseLevelIds.has(Number(l.id)))) { allowed = true; chosenBatch = String(bid); break; }
            }
          } catch {}
        }
        if (!active) return;
        setAuthorized(allowed);
        if (allowed && chosenBatch) {
          setActiveBatchId(chosenBatch);
          const sid = batchToStudent.get(String(chosenBatch)) || null;
          setActiveStudentId(sid);
        } else {
          setActiveBatchId(null);
          setActiveStudentId(null);
        }
      } catch (e:any) {
        if (!active) return;
        setError(e?.message || 'Authorization failed');
        setAuthorized(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false };
  }, [authLoaded, userLoaded, isSignedIn, user?.id, JSON.stringify(courseLevels)]);

  // Transform API shape to CoursePlaybackClientV2 props
  const playbackCourse = useMemo(() => {
    if (!course) return null;
    const sections = (course.curriculum || []).map((s) => ({
      id: String(s.id),
      title: s.title,
      lessons: (s.lessons || []).map((l) => {
        // Try multiple URL fields commonly used by our APIs
        // Try nested collections too
        const nested = (() => {
          const a: any = l as any;
          const arrays = [a.attachments, a.resources, a.materials, a.files, a.assets, a.media];
          for (const arr of arrays) {
            if (Array.isArray(arr) && arr.length > 0) {
              const first = arr[0] || {};
              const u = first.signed_url || first.url || first.file_url || first.video_url || first.path;
              if (u) return u;
            }
          }
          // Objects commonly used
          const objs = [a.video, a.asset, a.document];
          for (const obj of objs) {
            if (obj) {
              const u = obj.signed_url || obj.url || obj.file_url || obj.video_url || obj.path;
              if (u) return u;
            }
          }
          return '';
        })();

        const rawUrl =
          (l as any).file_url ||
          (l as any).signed_url ||
          (l as any).fileUrl ||
          (l as any).videoUrl ||
          l.video_url ||
          (l as any).content_url ||
          l.url ||
          nested ||
          '';

        // Infer type when missing using URL extension hints
        const lower = typeof rawUrl === 'string' ? rawUrl.toLowerCase() : '';
        let inferred: any = (l as any).type || 'lesson';
        if (!l.type && lower) {
          if (lower.endsWith('.mp4') || lower.includes('video')) inferred = 'video_file';
          else if (lower.endsWith('.pdf')) inferred = 'document';
        }

        // Prefer explicit content, fall back to common fields
        const contentHtml =
          (l as any).content ||
          (l as any).instructions ||
          (l as any).description ||
          (l as any).html ||
          (l as any).body ||
          '';

        return {
          id: String(l.id),
          title: l.title,
          type: inferred as any,
          duration: typeof l.duration === 'number' ? l.duration : undefined,
          content: contentHtml,
          video_url: rawUrl,
        };
      })
    }));
    return {
      id: String(course.id),
      title: course.title,
      overview: course.overview || course.description,
      curriculum: sections,
    };
  }, [course]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!authorized) {
    return (
      <div className="p-6 space-y-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-destructive mb-3">You don't have access to this course. It must be assigned to your batch.</div>
            <Button variant="outline" onClick={() => router.push('/student/levels')}>Back to My Levels</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!playbackCourse) return <div className="p-6">Course not found.</div>;

  if (!playbackCourse) return <div className="p-6">Course not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Client-updating Course Header */}
        <CourseHeaderClient title={playbackCourse.title} initialCurriculum={playbackCourse.curriculum} />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CourseSidebarClient initialCurriculum={playbackCourse.curriculum} courseId={playbackCourse.id} />
          </div>

          <div className="lg:col-span-3">
            <CourseMainClient initialCurriculum={playbackCourse.curriculum} courseId={playbackCourse.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
