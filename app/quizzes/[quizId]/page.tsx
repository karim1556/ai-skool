"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Loader } from '@/components/ui/loader';
import { CheckCircle, XCircle } from 'lucide-react';

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

  const progress = quiz ? (Object.keys(answers).length / quiz.questions.length) * 100 : 0;

  if (isLoading && !results) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Quiz not found.</p>
      </div>
    );
  }

  if (results) {
    const percentage = (results.score / results.total) * 100;
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl shadow-2xl rounded-2xl">
          <CardHeader className="text-center bg-gray-50 dark:bg-gray-800 p-8 rounded-t-2xl">
            <CardTitle className="text-3xl font-bold">Quiz Results: {quiz.title}</CardTitle>
            <p className="text-5xl font-bold mt-4" style={{ color: percentage >= 70 ? '#22c55e' : '#ef4444' }}>
              {percentage.toFixed(1)}%
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">Your score: {results.score} out of {results.total}</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              {quiz.questions.map(q => (
                <div key={q.id} className={`p-4 rounded-lg flex items-center gap-4 ${results.results[q.id] ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'}`}>
                  {results.results[q.id] ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                  <p className="font-semibold flex-1 text-gray-800 dark:text-gray-200">{q.question_text}</p>
                </div>
              ))}
            </div>
            <Button onClick={handleRetake} size="lg" className="w-full text-lg py-6 rounded-lg">Retake Quiz</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="p-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{quiz.title}</CardTitle>
            <div className="mt-4">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2"> {Object.keys(answers).length} of {quiz.questions.length} answered</p>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="border-t border-gray-200 dark:border-gray-700 pt-6 first:border-t-0 first:pt-0">
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-5">Question {index + 1}</p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-5">{question.question_text}</p>
                <RadioGroup onValueChange={(value) => handleAnswerChange(question.id, value)} value={answers[question.id] || ''} className="space-y-3">
                  {question.options.map(option => (
                    <Label key={option.id} htmlFor={`${question.id}-${option.id}`} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${answers[question.id] === option.id ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-transparent'}`}>
                      <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} className="w-5 h-5" />
                      <span className="ml-4 text-md font-medium text-gray-800 dark:text-gray-200">{option.option_text}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button onClick={handleSubmit} disabled={isLoading || Object.keys(answers).length !== quiz.questions.length} size="lg" className="w-full text-lg py-7 rounded-lg font-bold">
              {isLoading ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
