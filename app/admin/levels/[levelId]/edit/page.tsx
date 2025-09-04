"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";

export default function EditLevelPage() {
  const router = useRouter();
  const params = useParams();
  const levelId = Number(params?.levelId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    level_order: 1,
    description: "",
    subtitle: "",
    who_is_this_for: "",
    what_you_will_learn: "",
    prerequisites: "",
    included_courses_note: "",
    estimated_duration: "",
    language: "",
    is_free: false as boolean,
    price: "" as string | number,
    original_price: "" as string | number,
    meta_keywords: "",
    meta_description: "",
    thumbnail: "",
  });

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  useEffect(() => {
    if (!Number.isFinite(levelId)) return;
    (async () => {
      try {
        const res = await fetch(`/api/levels/${levelId}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            name: data.name || "",
            category: data.category || "",
            level_order: Number(data.level_order || 1),
            description: data.description || "",
            subtitle: data.subtitle || "",
            who_is_this_for: data.who_is_this_for || "",
            what_you_will_learn: data.what_you_will_learn || "",
            prerequisites: data.prerequisites || "",
            included_courses_note: data.included_courses_note || "",
            estimated_duration: data.estimated_duration || "",
            language: data.language || "",
            is_free: !!data.is_free,
            price: data.price ?? "",
            original_price: data.original_price ?? "",
            meta_keywords: data.meta_keywords || "",
            meta_description: data.meta_description || "",
            thumbnail: data.thumbnail || "",
          });
        } else {
          alert(data?.error || "Failed to load level");
          router.back();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [levelId, router]);

  const onSubmit = async () => {
    if (!Number.isFinite(levelId)) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", String(form.name));
      fd.set("category", String(form.category));
      fd.set("level_order", String(form.level_order));
      fd.set("description", String(form.description));
      if (form.subtitle) fd.set("subtitle", String(form.subtitle));
      if (form.who_is_this_for) fd.set("who_is_this_for", String(form.who_is_this_for));
      if (form.what_you_will_learn) fd.set("what_you_will_learn", String(form.what_you_will_learn));
      if (form.prerequisites) fd.set("prerequisites", String(form.prerequisites));
      if (form.included_courses_note) fd.set("included_courses_note", String(form.included_courses_note));
      if (form.estimated_duration) fd.set("estimated_duration", String(form.estimated_duration));
      if (form.language) fd.set("language", String(form.language));
      fd.set("is_free", String(form.is_free));
      if (form.price !== "" && form.price != null) fd.set("price", String(form.price));
      if (form.original_price !== "" && form.original_price != null) fd.set("original_price", String(form.original_price));
      fd.set("meta_keywords", String(form.meta_keywords || ""));
      fd.set("meta_description", String(form.meta_description || ""));
      if (thumbnailFile) fd.set("thumbnail_file", thumbnailFile);

      const res = await fetch(`/api/levels/${levelId}`, { method: "PATCH", body: fd });
      if (res.ok) {
        router.push("/admin/levels");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Failed to save level");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!Number.isFinite(levelId)) return <div className="p-6">Invalid level ID</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Edit Level</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={e => set("name", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={form.category} onChange={e => set("category", e.target.value)} placeholder="e.g. General" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="subtitle">Subtitle (short tagline)</Label>
              <Input id="subtitle" value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="e.g. Build your fundamentals with Level 1" />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" value={form.level_order} onChange={e => set("level_order", Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-2">
              <input id="is_free" type="checkbox" checked={form.is_free} onChange={e => set("is_free", e.target.checked)} />
              <Label htmlFor="is_free">Is Free</Label>
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" step="0.01" value={form.price as any} onChange={e => set("price", e.target.value)} placeholder="e.g. 4999" />
            </div>
            <div>
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <Input id="original_price" type="number" step="0.01" value={form.original_price as any} onChange={e => set("original_price", e.target.value)} placeholder="e.g. 9999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_file">Thumbnail image (optional)</Label>
              {form.thumbnail && (
                <div className="w-full max-w-xs">
                  <Image src={form.thumbnail} alt={form.name || "thumbnail"} width={400} height={225} className="rounded-md border object-cover" />
                </div>
              )}
              <Input id="thumbnail_file" type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => set("description", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="who_is_this_for">Who is this for?</Label>
              <Textarea id="who_is_this_for" value={form.who_is_this_for} onChange={e => set("who_is_this_for", e.target.value)} placeholder="e.g. Absolute beginners, students from any stream..." />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="what_you_will_learn">What you will learn</Label>
              <Textarea id="what_you_will_learn" value={form.what_you_will_learn} onChange={e => set("what_you_will_learn", e.target.value)} placeholder="List bullet points, one per line" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea id="prerequisites" value={form.prerequisites} onChange={e => set("prerequisites", e.target.value)} placeholder="e.g. Basic computer knowledge" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="included_courses_note">Included courses note</Label>
              <Textarea id="included_courses_note" value={form.included_courses_note} onChange={e => set("included_courses_note", e.target.value)} placeholder="e.g. Includes 5 foundation courses covering..." />
            </div>
            <div>
              <Label htmlFor="estimated_duration">Estimated duration</Label>
              <Input id="estimated_duration" value={form.estimated_duration} onChange={e => set("estimated_duration", e.target.value)} placeholder="e.g. 8-10 weeks" />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Input id="language" value={form.language} onChange={e => set("language", e.target.value)} placeholder="e.g. English" />
            </div>
            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input id="meta_keywords" value={form.meta_keywords} onChange={e => set("meta_keywords", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Input id="meta_description" value={form.meta_description} onChange={e => set("meta_description", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </AdminLayout>
    </Protect>
  );
}
