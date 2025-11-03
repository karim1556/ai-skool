"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Loader } from '@/components/ui/loader';
import { CheckCircle, XCircle, ArrowLeft, Award, Repeat } from 'lucide-react';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ score: number; total: number; results: Record<string, boolean> } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (quizId) fetchQuizDetails();
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

      // Persist attempt to progress API if context is provided
      const courseId = searchParams.get('courseId') || undefined;
      const sectionId = searchParams.get('sectionId') || undefined;
      const role = (searchParams.get('role') as 'student'|'trainer'|null) || null;
      const studentId = searchParams.get('studentId') || undefined;
      const trainerId = searchParams.get('trainerId') || undefined;
      const batchId = searchParams.get('batchId') || undefined;
      if (courseId && role) {
        const payload: any = {
          course_id: courseId,
          section_id: sectionId || 'unknown',
          quiz_id: quizId,
          role,
          score: Number(data?.score ?? 0),
          max_score: Number(data?.total ?? 0) || 0,
        };
        if (role === 'student') { payload.student_id = studentId; payload.batch_id = batchId; }
        else { payload.trainer_id = trainerId; }
        try {
          await fetch('/api/progress/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch {}
      }
    } catch (error) {
      toast.error('There was an error submitting your quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResults(null);
    setCurrentQuestionIndex(0);
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const progress = quiz ? (Object.keys(answers).length / quiz.questions.length) * 100 : 0;

  if (isLoading && !results) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-500">Quiz not found.</p>
      </div>
    );
  }

  if (results) {
    const percentage = (results.score / results.total) * 100;
    const isPassed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-3xl shadow-xl rounded-2xl border-t-8 ${isPassed ? 'border-green-500' : 'border-red-500'}">
          <CardHeader className="text-center p-8">
            <Award className={`mx-auto h-16 w-16 ${isPassed ? 'text-green-500' : 'text-red-500'}`} />
            <CardTitle className="text-3xl font-bold mt-4">Quiz Complete!</CardTitle>
            <p className="text-lg text-gray-600 mt-2">You scored {results.score} out of {results.total}.</p>
            <p className={`text-6xl font-bold mt-4 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {percentage.toFixed(0)}%
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-6 bg-gray-50/80">
            <h3 className="text-xl font-semibold text-center">Review Your Answers</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {quiz.questions.map(q => (
                <div key={q.id} className={`p-4 rounded-lg flex items-start gap-4 border ${results.results[q.id] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {results.results[q.id] ? <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />}
                  <p className="font-medium text-gray-800">{q.question_text}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-6 flex flex-col sm:flex-row gap-4 bg-gray-100 rounded-b-2xl">
            {(() => {
              const cid = searchParams.get('courseId') || '';
              const nextLessonId = searchParams.get('nextLessonId');
              const roundedPct = Math.round(percentage);

              return (
                <>
                  <div className="w-full sm:w-auto">
                    <Button onClick={() => router.push(`/student/learn/course/${cid}`)} variant="outline" size="lg" className="w-full text-lg">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Course
                    </Button>
                  </div>

                  <div className="flex-1 flex items-center justify-end gap-4 w-full">
                    {nextLessonId && (
                      <Button onClick={() => router.push(`/student/learn/course/${cid}?lessonId=${encodeURIComponent(nextLessonId)}`)} size="lg" className="w-full sm:w-auto text-lg">
                        Next
                      </Button>
                    )}

                    {roundedPct < 100 && (
                      <Button onClick={handleRetake} size="lg" className="w-full sm:w-auto text-lg">
                        <Repeat className="w-5 h-5 mr-2" />
                        Retake Quiz
                      </Button>
                    )}
                  </div>
                </>
              );
            })()}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{quiz.title}</h1>
            <p className="text-gray-500 mt-1">Complete all questions to finish the quiz.</p>
        </div>
        <Card className="shadow-lg rounded-2xl overflow-hidden border">
          <CardHeader className="p-6 bg-white border-b">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
                <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 mt-2" />
          </CardHeader>
          <CardContent className="p-8">
            {quiz.questions.length > 0 && (
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-6">{quiz.questions[currentQuestionIndex].question_text}</p>
                <RadioGroup onValueChange={(value) => handleAnswerChange(quiz.questions[currentQuestionIndex].id, value)} value={answers[quiz.questions[currentQuestionIndex].id] || ''} className="space-y-4">
                  {quiz.questions[currentQuestionIndex].options.map(option => (
                    <Label key={option.id} htmlFor={`${quiz.questions[currentQuestionIndex].id}-${option.id}`} className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ease-in-out ${answers[quiz.questions[currentQuestionIndex].id] === option.id ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white hover:bg-gray-50 border-gray-200'}`}>
                      <RadioGroupItem value={option.id} id={`${quiz.questions[currentQuestionIndex].id}-${option.id}`} className="w-5 h-5" />
                      <span className="ml-4 text-lg font-medium text-gray-700">{option.option_text}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between w-full">
              <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} size="lg" className="text-lg py-6 font-bold">
                Previous
              </Button>
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <Button onClick={handleSubmit} disabled={isLoading || Object.keys(answers).length !== quiz.questions.length} size="lg" className="text-lg py-6 font-bold">
                  {isLoading ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button onClick={handleNext} size="lg" className="text-lg py-6 font-bold">
                  Next
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
