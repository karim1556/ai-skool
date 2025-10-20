"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AddProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Arduino');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [image, setImage] = useState('/images/placeholder.svg');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title,
      shortDescription,
      description,
      category,
      difficulty,
      image,
      components: [],
      tags: [],
      featured: false,
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push('/projects');
      } else {
        console.error('Failed to create project');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Project</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Short description</label>
          <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border rounded-md p-2 h-36" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Difficulty</label>
            <input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Project'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/projects')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
