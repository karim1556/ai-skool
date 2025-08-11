"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface QuizDetails {
  id: string;
  title: string;
  description: string;
  time_limit: number | null;
  passing_score: number | null;
  max_attempts: number | null;
  section_id: string;
}

interface AddQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newQuiz: any) => void;
  onEdit: (updatedQuiz: any) => void;
  quizToEdit: QuizDetails | null;
  sections: { id: string; title: string }[];
}

export function AddQuizModal({ isOpen, onClose, onAdd, onEdit, quizToEdit, sections }: AddQuizModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [passingScore, setPassingScore] = useState('');
  const [maxAttempts, setMaxAttempts] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = quizToEdit !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && quizToEdit) {
        setTitle(quizToEdit.title);
        setDescription(quizToEdit.description || '');
        setTimeLimit(String(quizToEdit.time_limit || ''));
        setPassingScore(String(quizToEdit.passing_score || ''));
        setMaxAttempts(String(quizToEdit.max_attempts || ''));
        setSelectedSection(quizToEdit.section_id);
      } else {
        setTitle('');
        setDescription('');
        setTimeLimit('');
        setPassingScore('');
        setMaxAttempts('');
        setSelectedSection('');
      }
    }
  }, [quizToEdit, isOpen]);

  const handleSave = async () => {
    if (!title || !selectedSection) {
      toast.error('Please provide a title and select a section.');
      return;
    }

    setIsLoading(true);
    try {
      const url = isEditMode ? `/api/quizzes/${quizToEdit.id}` : `/api/sections/${selectedSection}/quizzes`;
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          time_limit: timeLimit ? parseInt(timeLimit, 10) : null,
          passing_score: passingScore ? parseInt(passingScore, 10) : null,
          max_attempts: maxAttempts ? parseInt(maxAttempts, 10) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quiz');
      }

      const result = await response.json();
      toast.success(`Quiz ${isEditMode ? 'updated' : 'added'} successfully!`);
      if (isEditMode) {
        onEdit(result);
      } else {
        onAdd(result);
      }
      onClose();

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
          <DialogTitle>{isEditMode ? 'Edit Quiz' : 'Add New Quiz'}</DialogTitle>
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
              Quiz Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instruction" className="text-right">
              Instruction
            </Label>
            <Textarea id="instruction" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Quiz instructions..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max_attempts" className="text-right">
              Max quiz Attempts
            </Label>
            <Input id="max_attempts" type="number" value={maxAttempts} onChange={(e) => setMaxAttempts(e.target.value)} className="col-span-3" placeholder="e.g., 3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time_limit" className="text-right">
              Timer value (minutes)
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
            {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
