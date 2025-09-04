"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface Attachment {
  id?: string;
  title: string;
  url: string;
}

interface ExternalLink {
  id?: string;
  title: string;
  url: string;
}

interface CourseDetails {
  id: string;
  objectives: string[];
  demo_video_url?: string;
  attachments?: Attachment[];
  external_links?: ExternalLink[]; // Match the database schema
}

interface CourseDetailsEditorProps {
  course: CourseDetails;
}

export const CourseDetailsEditor = ({ course }: CourseDetailsEditorProps) => {
  // Helper to safely parse props that might be JSON strings
  const parseJsonSafe = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Failed to parse JSON string, defaulting to empty array:", e);
        return [];
      }
    }
    return [];
  };

  const [objectives, setObjectives] = useState<string[]>(parseJsonSafe(course.objectives));
  const [demoVideoUrl, setDemoVideoUrl] = useState(course.demo_video_url || '');
  const [attachments, setAttachments] = useState<Attachment[]>(parseJsonSafe(course.attachments));
    const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(parseJsonSafe(course.external_links));
  
  const [newObjective, setNewObjective] = useState('');

  const [newExternalLink, setNewExternalLink] = useState({ title: '', url: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Objectives Handlers ---
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleUpdateObjective = (index: number, value: string) => {
    const updatedItems = objectives.map((item, i) => (i === index ? value : item));
    setObjectives(updatedItems);
  };

  // --- Attachments Handlers ---
  const handleAddAttachment = () => {
    setAttachments([...attachments, { title: '', url: '' }]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleUpdateAttachment = (index: number, field: 'title' | 'url', value: string) => {
    const updatedItems = attachments.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setAttachments(updatedItems);
  };

  // --- External Links Handlers ---
  const handleAddExternalLink = () => {
    if (newExternalLink.title.trim() && newExternalLink.url.trim()) {
      setExternalLinks([...externalLinks, { ...newExternalLink }]);
      setNewExternalLink({ title: '', url: '' });
    }
  };

  const handleRemoveExternalLink = (index: number) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== index));
  };

  const handleUpdateExternalLink = (index: number, field: 'title' | 'url', value: string) => {
    const updatedItems = externalLinks.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setExternalLinks(updatedItems);
  };

  const handleFileChange = async (index: number, file: File | null) => {
    if (!file) return;

    const originalUrl = attachments[index].url;
    // Optimistically set a loading state for the URL
    handleUpdateAttachment(index, 'url', 'Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'File upload failed');
      }

      handleUpdateAttachment(index, 'url', result.url);
    } catch (error: any) {
      console.error('Upload failed:', error);
      // Revert on failure
      handleUpdateAttachment(index, 'url', originalUrl);
      alert(`Error uploading file: ${error.message}`);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${course.id}/details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          objectives,
          demo_video_url: demoVideoUrl,
          attachments,
          externalLinks
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update course details.');
      }
      alert('Learning objectives updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Learning Objectives Section */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
          <p className="text-sm text-gray-500">Define what students will learn in this course.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {objectives.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => handleUpdateObjective(index, e.target.value)}
                  className="flex-grow"
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveObjective(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Input
              placeholder="Add a new learning objective"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddObjective(); } }}
            />
            <Button type="button" variant="outline" onClick={handleAddObjective}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Video Section */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Video</CardTitle>
          <p className="text-sm text-gray-500">Provide a URL for the course's promotional video.</p>
        </CardHeader>
        <CardContent>
          <Label htmlFor="demo-video-url">Demo Video URL</Label>
          <Input
            id="demo-video-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={demoVideoUrl}
            onChange={(e) => setDemoVideoUrl(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
          <p className="text-sm text-gray-500">Manage course documents and downloadable materials.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attachments.map((att, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                <Input
                  placeholder="Title"
                  value={att.title}
                  onChange={(e) => handleUpdateAttachment(index, 'title', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <>
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)}
                      className="flex-grow"
                    />
                    {att.url && !att.url.startsWith('Uploading') && (
                      <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate">
                        {att.url.split('/').pop()}
                      </a>
                    )}
                    {att.url === 'Uploading...' && <p className="text-sm text-gray-500">Uploading...</p>}
                  </>
                  <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveAttachment(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">To add a new attachment, first click 'Add'.</p>
                <Button type="button" variant="outline" onClick={handleAddAttachment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Links Section */}
       <Card>
        <CardHeader>
          <CardTitle>External Links</CardTitle>
          <p className="text-sm text-gray-500">Provide relevant external links for students.</p>
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
            {externalLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                <Input
                  placeholder="Title"
                  value={link.title}
                  onChange={(e) => handleUpdateExternalLink(index, 'title', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => handleUpdateExternalLink(index, 'url', e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveExternalLink(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end mt-4">
            <Input
              placeholder="New Link Title"
              value={newExternalLink.title}
              onChange={(e) => setNewExternalLink({ ...newExternalLink, title: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <Input
                placeholder="New Link URL"
                value={newExternalLink.url}
                onChange={(e) => setNewExternalLink({ ...newExternalLink, url: e.target.value })}
                className="flex-grow"
              />
              <Button type="button" variant="outline" onClick={handleAddExternalLink}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'Saving...' : 'Save All Details'}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2 text-right">{error}</p>}
    </form>
  );
};

export default CourseDetailsEditor;
