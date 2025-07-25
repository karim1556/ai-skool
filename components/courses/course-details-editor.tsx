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
  externalLinks?: ExternalLink[];
}

interface CourseDetailsEditorProps {
  course: CourseDetails;
}

export const CourseDetailsEditor = ({ course }: CourseDetailsEditorProps) => {
  const [objectives, setObjectives] = useState<string[]>(course.objectives || []);
  const [demoVideoUrl, setDemoVideoUrl] = useState(course.demo_video_url || '');
  const [attachments, setAttachments] = useState<Attachment[]>(course.attachments || []);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(course.externalLinks || []);
  
  const [newObjective, setNewObjective] = useState('');
  const [newAttachment, setNewAttachment] = useState({ title: '', url: '' });
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
    const updatedItems = [...objectives];
    updatedItems[index] = value;
    setObjectives(updatedItems);
  };

  // --- Attachments Handlers ---
  const handleAddAttachment = () => {
    if (newAttachment.title.trim() && newAttachment.url.trim()) {
      setAttachments([...attachments, { ...newAttachment }]);
      setNewAttachment({ title: '', url: '' });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleUpdateAttachment = (index: number, field: 'title' | 'url', value: string) => {
    const updatedItems = [...attachments];
    updatedItems[index][field] = value;
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
    const updatedItems = [...externalLinks];
    updatedItems[index][field] = value;
    setExternalLinks(updatedItems);
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
                  <Input
                    placeholder="URL"
                    value={att.url}
                    onChange={(e) => handleUpdateAttachment(index, 'url', e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveAttachment(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end mt-4">
            <Input
              placeholder="New Attachment Title"
              value={newAttachment.title}
              onChange={(e) => setNewAttachment({ ...newAttachment, title: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <Input
                placeholder="New Attachment URL"
                value={newAttachment.url}
                onChange={(e) => setNewAttachment({ ...newAttachment, url: e.target.value })}
                className="flex-grow"
              />
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
