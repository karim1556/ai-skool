"use client"

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Protect } from "@clerk/nextjs";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";

export default function ManageLevelCoursesPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = Number(params?.levelId);
  const [level, setLevel] = useState<any | null>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [assigned, setAssigned] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [labelSelections, setLabelSelections] = useState<Record<string, string>>({});
  const labelOptions = ["Easy", "Intermediate", "Advanced"];

  useEffect(() => {
    if (!Number.isFinite(levelId)) return;
    (async () => {
      const [lRes, cRes, aRes] = await Promise.all([
        fetch(`/api/levels/${levelId}`),
        fetch(`/api/courses`),
        fetch(`/api/levels/${levelId}/courses`),
      ]);
      const l = await lRes.json();
      setLevel(l?.error ? null : l);
      const c = await cRes.json();
      setAllCourses(Array.isArray(c) ? c : []);
      const assignedCourses = await aRes.json();
      const map: Record<string, boolean> = {};
      (Array.isArray(assignedCourses) ? assignedCourses : []).forEach((course: any) => {
        map[String(course.id)] = true;
      });
      setAssigned(map);
    })();
  }, [levelId]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCourses.filter((c) =>
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.provider?.toLowerCase().includes(q)
    );
  }, [allCourses, query]);

  const assign = async (courseId: string | number) => {
    const label = labelSelections[String(courseId)] || "Easy";
    await fetch(`/api/levels/${levelId}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId, label }),
    });
    setAssigned({ ...assigned, [String(courseId)]: true });
  };

  const unassign = async (courseId: string | number) => {
    await fetch(`/api/levels/${levelId}/courses?course_id=${encodeURIComponent(String(courseId))}`, {
      method: 'DELETE',
    });
    const copy = { ...assigned };
    delete copy[String(courseId)];
    setAssigned(copy);
  };

  if (!Number.isFinite(levelId)) return <div className="p-6">Invalid level</div>;

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/admin/levels')} className="h-9">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Levels
            </Button>
            <h1 className="text-2xl font-bold">Manage Courses for: {level?.name}</h1>
            {level?.category && <Badge variant="secondary">{level.category}</Badge>}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Search Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input placeholder="Search by title or provider" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">Title</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Level (text)</th>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((c, idx) => {
                      const isAssigned = !!assigned[String(c.id)];
                      return (
                        <tr key={c.id} className="border-b">
                          <td className="p-3">{idx + 1}</td>
                          <td className="p-3">
                            <div className="font-medium">{c.title}</div>
                            <div className="text-xs text-gray-500">{c.provider}</div>
                          </td>
                          <td className="p-3">{c.category}</td>
                          <td className="p-3">{c.level || <span className="text-gray-400">—</span>}</td>
                          <td className="p-3">
                            {!isAssigned && (
                              <select
                                className="border rounded px-2 py-1 text-sm mr-2"
                                value={labelSelections[String(c.id)] || "Easy"}
                                onChange={e => setLabelSelections(ls => ({ ...ls, [String(c.id)]: e.target.value }))}
                              >
                                {labelOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            )}
                            {isAssigned ? (
                              <Button variant="destructive" size="sm" onClick={() => unassign(c.id)}>
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => assign(c.id)}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </Protect>
  );
}
