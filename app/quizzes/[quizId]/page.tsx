"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface QuizOption {
  id: string;
  option_text: string;
}

interface QuizQuestion {
  id: string;
  question_text: string;
  options: QuizOption[];
}

interface Quiz {
    id: string;
    title: string;
    questions: QuizQuestion[];
}

export default function QuizPlaybackPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ score: number; total: number; results: Record<string, boolean> } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (quizId) {
      fetchQuizDetails();
    }
  }, [quizId]);

  const fetchQuizDetails = async () => {
    setIsLoading(true);
    try {
      const [quizRes, questionsRes] = await Promise.all([
        fetch(`/api/quizzes/${quizId}`),
        fetch(`/api/quizzes/${quizId}/questions`)
      ]);

      if (!quizRes.ok || !questionsRes.ok) throw new Error('Failed to load quiz data');

      const quizData = await quizRes.json();
      const questionsData = await questionsRes.json();
      
      setQuiz({ ...quizData, questions: questionsData });
    } catch (error) {
      toast.error('Could not load the quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error('Failed to submit quiz');

      const data = await response.json();
      setResults(data);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error('There was an error submitting your quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResults(null);
  };

  if (isLoading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results: {quiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-bold">Your score: {results.score} / {results.total}</p>
            <div>
              {quiz.questions.map(q => (
                <div key={q.id} className={`p-3 my-2 rounded-lg ${results.results[q.id] ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className="font-semibold">{q.question_text}</p>
                  {/* You can add more details here, like showing the correct answer */}
                </div>
              ))}
            </div>
            <Button onClick={handleRetake}>Retake Quiz</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id}>
              <p className="font-semibold mb-2">{index + 1}. {question.question_text}</p>
              <RadioGroup onValueChange={(value) => handleAnswerChange(question.id, value)} value={answers[question.id] || ''}>
                {question.options.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                    <Label htmlFor={`${question.id}-${option.id}`}>{option.option_text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button onClick={handleSubmit} disabled={isLoading || Object.keys(answers).length !== quiz.questions.length}>
            {isLoading ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
