"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newQuiz: any) => void;
  sections: { id: string; title: string }[];
}

export function AddQuizModal({ isOpen, onClose, onAdd, sections }: AddQuizModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !selectedSection) {
      toast.error('Please provide a title and select a section.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/sections/${selectedSection}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          time_limit: timeLimit ? parseInt(timeLimit, 10) : null,
          passing_score: passingScore ? parseInt(passingScore, 10) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quiz');
      }

      const newQuiz = await response.json();
      toast.success('Quiz added successfully!');
      onAdd(newQuiz);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setTimeLimit('');
      setPassingScore('');
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
          <DialogTitle>Add New Quiz</DialogTitle>
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
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Quiz description..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time_limit" className="text-right">
              Time Limit (mins)
            </Label>
            <Input id="time_limit" type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="col-span-3" placeholder="e.g., 60" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="passing_score" className="text-right">
              Passing Score (%)
            </Label>
            <Input id="passing_score" type="number" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} className="col-span-3" placeholder="e.g., 70" />
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
