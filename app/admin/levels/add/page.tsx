"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Protect } from "@clerk/nextjs";

export default function AddLevelPage() {
  const router = useRouter();
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
    is_free: false,
    price: "",
    original_price: "",
    meta_keywords: "",
    meta_description: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const onSubmit = async () => {
    if (!thumbnailFile) {
      alert('Please select a thumbnail image');
      return;
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.set('name', form.name)
      fd.set('category', form.category)
      fd.set('level_order', String(form.level_order))
      fd.set('description', form.description)
      if (form.subtitle) fd.set('subtitle', form.subtitle)
      if (form.who_is_this_for) fd.set('who_is_this_for', form.who_is_this_for)
      if (form.what_you_will_learn) fd.set('what_you_will_learn', form.what_you_will_learn)
      if (form.prerequisites) fd.set('prerequisites', form.prerequisites)
      if (form.included_courses_note) fd.set('included_courses_note', form.included_courses_note)
      if (form.estimated_duration) fd.set('estimated_duration', form.estimated_duration)
      if (form.language) fd.set('language', form.language)
      fd.set('is_free', String(form.is_free))
      if (form.price) fd.set('price', String(form.price))
      if (form.original_price) fd.set('original_price', String(form.original_price))
      fd.set('meta_keywords', form.meta_keywords)
      fd.set('meta_description', form.meta_description)
      fd.set('thumbnail_file', thumbnailFile)

      const res = await fetch('/api/levels', { method: 'POST', body: fd })
      if (res.ok) {
        router.push('/admin/levels')
      } else {
        const err = await res.json().catch(() => ({}))
        console.error('Failed to create level', err)
        alert(err?.error || 'Failed to create level')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Protect role="admin" fallback={<p>Access denied</p>}>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Add Level</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. General" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="subtitle">Subtitle (short tagline)</Label>
              <Input id="subtitle" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="e.g. Build your fundamentals with Level 1" />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" value={form.level_order} onChange={e => set('level_order', Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-2">
              <input id="is_free" type="checkbox" checked={form.is_free} onChange={e => set('is_free', e.target.checked)} />
              <Label htmlFor="is_free">Is Free</Label>
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 4999" />
            </div>
            <div>
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <Input id="original_price" type="number" step="0.01" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="e.g. 9999" />
            </div>
            <div>
              <Label htmlFor="thumbnail_file">Thumbnail image (required)</Label>
              <Input id="thumbnail_file" type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="who_is_this_for">Who is this for?</Label>
              <Textarea id="who_is_this_for" value={form.who_is_this_for} onChange={e => set('who_is_this_for', e.target.value)} placeholder="e.g. Absolute beginners, students from any stream..." />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="what_you_will_learn">What you will learn</Label>
              <Textarea id="what_you_will_learn" value={form.what_you_will_learn} onChange={e => set('what_you_will_learn', e.target.value)} placeholder="List bullet points, one per line" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea id="prerequisites" value={form.prerequisites} onChange={e => set('prerequisites', e.target.value)} placeholder="e.g. Basic computer knowledge" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="included_courses_note">Included courses note</Label>
              <Textarea id="included_courses_note" value={form.included_courses_note} onChange={e => set('included_courses_note', e.target.value)} placeholder="e.g. Includes 5 foundation courses covering..." />
            </div>
            <div>
              <Label htmlFor="estimated_duration">Estimated duration</Label>
              <Input id="estimated_duration" value={form.estimated_duration} onChange={e => set('estimated_duration', e.target.value)} placeholder="e.g. 8-10 weeks" />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Input id="language" value={form.language} onChange={e => set('language', e.target.value)} placeholder="e.g. English" />
            </div>
            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input id="meta_keywords" value={form.meta_keywords} onChange={e => set('meta_keywords', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Input id="meta_description" value={form.meta_description} onChange={e => set('meta_description', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} disabled={submitting}>{submitting ? 'Creating...' : 'Create Level'}</Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      </AdminLayout>
    </Protect>
  )
}
