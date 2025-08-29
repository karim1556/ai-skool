"use client"

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Protect } from "@clerk/nextjs";

export default function LevelsPage() {
  const router = useRouter();
  const [levels, setLevels] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/levels');
      const data = await res.json();
      setLevels(Array.isArray(data) ? data : []);
    })();
  }, []);

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">🎯 Levels</h1>
            <Button onClick={() => router.push('/admin/levels/add')}>Add Level</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((l) => (
              <div key={l.id} className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <div className="aspect-[16/9] bg-gray-100">
                  {l.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No thumbnail</div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{l.name}</h3>
                    <Badge variant="secondary">{l.category}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">Order: {l.level_order}</p>
                  {l.description ? (
                    <p className="text-sm text-gray-600 line-clamp-2">{l.description}</p>
                  ) : null}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <div>
                      {l.is_free ? (
                        <span className="text-base font-semibold text-green-600">Free</span>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          {typeof l.price === 'number' && (
                            <span className="text-base font-semibold text-pink-600">₹{l.price}</span>
                          )}
                          {typeof l.original_price === 'number' && typeof l.price === 'number' && l.original_price > l.price && (
                            <span className="text-sm text-gray-400 line-through">₹{l.original_price}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/levels/${l.id}`)}>
                        Manage Courses
                      </Button>
                      <Button size="sm" onClick={() => router.push(`/admin/levels/${l.id}/edit`)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={async () => {
                        if (!confirm('Delete this level? This cannot be undone.')) return;
                        const res = await fetch(`/api/levels/${l.id}`, { method: 'DELETE' });
                        if (res.ok) {
                          // simple reload to reflect deletion
                          window.location.reload();
                        } else {
                          const err = await res.json().catch(() => ({}));
                          alert(err?.error || 'Failed to delete');
                        }
                      }}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </Protect>
  );
}
