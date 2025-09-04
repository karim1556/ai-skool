"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CoursePlaybackClientV2 from "@/components/courses/course-playback-client-v2";

interface ApiLesson {
  id: string | number;
  title: string;
  type?: string;
  duration?: number | string;
  content?: string;
  video_url?: string;
  url?: string;
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

export default function TrainerCoursePlaybackPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = String(courseId);
  const router = useRouter();

  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [courseLevels, setCourseLevels] = useState<any[]>([]);
  const [trainerIdDb, setTrainerIdDb] = useState<string | null>(null);

  // Load course and levels
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

  // Authorization for trainer: trainer's assigned levels must include any course level
  useEffect(() => {
    let active = true;
    (async () => {
      if (!authLoaded || !userLoaded || !orgLoaded) return;
      if (!isSignedIn || !organization?.id) { if (active){ setAuthorized(false); setLoading(false);} return; }
      try {
        setLoading(true);
        setError(null);
        const courseLevelIds = new Set((courseLevels || []).map((l:any) => Number(l.id)));

        // resolve school and current trainer record
        try { await fetch('/api/sync/me', { method: 'POST', cache: 'no-store' }) } catch {}
        const schoolRes = await fetch('/api/me/school', { cache: 'no-store' });
        const school = schoolRes.ok ? await schoolRes.json() : null;
        const sid = school?.schoolId;
        let allowed = false; let resolvedTrainerId: string | null = null;
        if (sid) {
          const trRes = await fetch(`/api/trainers?schoolId=${encodeURIComponent(sid)}`, { cache: 'no-store' });
          const tr = await trRes.json();
          if (trRes.ok && Array.isArray(tr)) {
            const myEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
            const mine = tr.find((t:any) => (t.email || '').toLowerCase() === (myEmail || ''));
            if (mine?.id) {
              const lvRes = await fetch(`/api/trainers/${mine.id}/levels`, { cache: 'no-store' });
              const lv = await lvRes.json();
              if (lvRes.ok && Array.isArray(lv)) {
                allowed = lv.some((l:any) => courseLevelIds.has(Number(l.id)));
                if (allowed) resolvedTrainerId = String(mine.id);
              }
            }
          }
        }
        if (!active) return;
        setAuthorized(Boolean(allowed));
        setTrainerIdDb(resolvedTrainerId);
      } catch (e:any) {
        if (!active) return;
        setError(e?.message || 'Authorization failed');
        setAuthorized(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false };
  }, [authLoaded, userLoaded, orgLoaded, isSignedIn, organization?.id, user?.primaryEmailAddress?.emailAddress, JSON.stringify(courseLevels)]);

  // Normalize to playback component
  const playbackCourse = useMemo(() => {
    if (!course) return null;
    const sections = (course.curriculum || []).map((s) => ({
      id: String(s.id),
      title: s.title,
      lessons: (s.lessons || []).map((l) => {
        const rawUrl =
          (l as any).file_url ||
          (l as any).signed_url ||
          (l as any).fileUrl ||
          (l as any).videoUrl ||
          l.video_url ||
          (l as any).content_url ||
          (l as any).url ||
          '';

        const lower = typeof rawUrl === 'string' ? rawUrl.toLowerCase() : '';
        let inferred: any = (l as any).type || 'lesson';
        if (!l.type && lower) {
          if (lower.endsWith('.mp4') || lower.includes('video')) inferred = 'video_file';
          else if (lower.endsWith('.pdf')) inferred = 'document';
        }

        return {
          id: String(l.id),
          title: l.title,
          type: inferred as any,
          duration: typeof l.duration === 'number' ? l.duration : undefined,
          content: l.content,
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
            <div className="text-sm text-destructive mb-3">You don't have access to this course. It must be assigned to you via a level.</div>
            <Button variant="outline" onClick={() => router.push('/trainer/levels')}>Back to My Levels</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!playbackCourse) return <div className="p-6">Course not found.</div>;

  return (
    <div className="min-h-screen">
      <CoursePlaybackClientV2
        course={playbackCourse as any}
        role="trainer"
        courseId={id}
        trainerId={trainerIdDb || undefined}
      />
    </div>
  );
}
