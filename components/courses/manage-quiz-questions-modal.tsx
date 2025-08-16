"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';

// Define the types for quiz questions and options
interface QuizOption {
  id?: string;
  option_text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: string;
  question_text: string;
  options: QuizOption[];
}

interface ManageQuizQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: { id: string; title: string } | null;
}

export function ManageQuizQuestionsModal({ isOpen, onClose, quiz }: ManageQuizQuestionsModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<QuizOption[]>([{ option_text: '', is_correct: false }]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    if (quiz && isOpen) {
      fetchQuestions();
    }
  }, [quiz, isOpen]);

  const fetchQuestions = async () => {
    if (!quiz) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/questions`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      toast.error('Could not load quiz questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (index: number, text: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index].option_text = text;
    setNewOptions(updatedOptions);
  };

  const handleCorrectOptionChange = (index: number) => {
    const updatedOptions = newOptions.map((option, i) => ({
      ...option,
      is_correct: i === index,
    }));
    setNewOptions(updatedOptions);
  };

  const addOption = () => {
    setNewOptions([...newOptions, { option_text: '', is_correct: false }]);
  };

  const removeOption = (index: number) => {
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setNewOptions(updatedOptions);
  };

  const handleAddQuestion = async () => {
    if (!quiz || !newQuestionText.trim() || newOptions.some(o => !o.option_text.trim())) {
      toast.error('Please fill in the question and all option fields.');
      return;
    }
    if (!newOptions.some(o => o.is_correct)) {
      toast.error('Please mark one option as correct.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_text: newQuestionText, options: newOptions }),
      });

      if (!response.ok) throw new Error('Failed to add question');

      toast.success('Question added successfully!');
      setNewQuestionText('');
      setNewOptions([{ option_text: '', is_correct: false }]);
      fetchQuestions(); // Refresh the list
    } catch (error) {
      toast.error('Could not add question.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!quiz || !editingQuestion) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question_text: editingQuestion.question_text,
          options: editingQuestion.options
        }),
      });

      if (!response.ok) throw new Error('Failed to update question');

      toast.success('Question updated successfully!');
      setEditingQuestion(null);
      fetchQuestions(); // Refresh the list
    } catch (error) {
      toast.error('Could not update question.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!quiz) return;

    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');

      toast.success('Question deleted successfully!');
      fetchQuestions(); // Refresh the list
    } catch (error) {
      toast.error('Could not delete question.');
    }
  };

  if (!quiz) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Questions for: {quiz.title}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Add New Question Form */}
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Add New Question</h3>
            <div>
              <Label htmlFor="new-question">Question Text</Label>
              <Input id="new-question" value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} placeholder="Enter the question" />
            </div>
            <div>
              <Label>Options</Label>
              {newOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input type="radio" name="correct-option" checked={option.is_correct} onChange={() => handleCorrectOptionChange(index)} className="h-5 w-5"/>
                  <Input value={option.option_text} onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} />
                  <Button variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={newOptions.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Option
              </Button>
            </div>
            <Button onClick={handleAddQuestion} disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Question'}</Button>
          </div>

          {/* Existing Questions List */}
          <div className="space-y-4">
            <h3 className="font-semibold">Existing Questions</h3>
            {questions.length > 0 ? (
              questions.map((q) => (
                <div key={q.id} className="p-4 border rounded-lg">
                  <p className="font-medium">{q.question_text}</p>
                  <ul className="mt-2 list-disc list-inside">
                    {q.options.map(o => (
                      <li key={o.id} className={`${o.is_correct ? 'font-semibold text-green-600' : ''}`}>
                        {o.option_text}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingQuestion(JSON.parse(JSON.stringify(q)))}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(q.id)}>Delete</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No questions have been added to this quiz yet.</p>
            )}

            {editingQuestion && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Editing Question</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Question Text</Label>
                    <Input 
                      value={editingQuestion.question_text}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Options</Label>
                    {editingQuestion.options.map((opt, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Input 
                          type="radio" 
                          name={`edit-correct-option-${editingQuestion.id}`} 
                          checked={opt.is_correct}
                          onChange={() => {
                            const updatedOptions = editingQuestion.options.map((o, i) => ({...o, is_correct: i === index}));
                            setEditingQuestion({ ...editingQuestion, options: updatedOptions });
                          }}
                          className="h-5 w-5"
                        />
                        <Input 
                          value={opt.option_text}
                          onChange={(e) => {
                            const updatedOptions = [...editingQuestion.options];
                            updatedOptions[index].option_text = e.target.value;
                            setEditingQuestion({ ...editingQuestion, options: updatedOptions });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateQuestion} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                    <Button variant="outline" onClick={() => setEditingQuestion(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
