"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newAssignment: any) => void;
  sections: { id: string; title: string }[];
}

export function AddAssignmentModal({ isOpen, onClose, onAdd, sections }: AddAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [selectedSection, setSelectedSection] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !selectedSection) {
      toast.error('Please provide a title and select a section.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('duration', duration);
      formData.append('max_score', maxScore);
      formData.append('instructions', description); // Using description as instructions for now
      
      // Append the file if it exists
      if (attachment) {
        formData.append('file', attachment);
      }

      const response = await fetch(`/api/sections/${selectedSection}/assignments`, {
        method: 'POST',
        // Don't set Content-Type header - the browser will set it with the correct boundary
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create assignment';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse JSON error, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const newAssignment = await response.json();
      toast.success('Assignment added successfully!');
      onAdd(newAssignment);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setDuration('');
      setMaxScore('');
      setAttachment(null);
      setSelectedSection('');

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Assignment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="section" className="text-right">
              Section
            </Label>
            <Select onValueChange={setSelectedSection} value={selectedSection}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Assignment Instructions
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Assignment instructions..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="col-span-3" placeholder="e.g., 2 hours 30 minutes" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max_score" className="text-right">
              Total Points
            </Label>
            <Input id="max_score" type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="col-span-3" placeholder="e.g., 100" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attachment" className="text-right">
              Attachment
            </Label>
            <Input id="attachment" type="file" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
