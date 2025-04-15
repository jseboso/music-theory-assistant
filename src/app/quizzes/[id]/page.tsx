"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button, LinkButton } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface QuizParams {
  params: {
    id: string;
  };
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export default function QuizPage({ params }: QuizParams) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Array<number | null>>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        router.push('/login');
        return;
      }
      
      setUser(data.user);
      
      // Fetch quiz data
      try {
        const { data: quizData, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (error) throw error;
        
        setQuiz(quizData);
        
        // Fetch questions for this quiz
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', params.id)
          .order('id', { ascending: true });
          
        if (questionsError) throw questionsError;
        
        setQuestions(questionsData || []);
        setUserAnswers(new Array(questionsData?.length || 0).fill(null));
        
        // Check if user has already completed this quiz
        const { data: resultData, error: resultError } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('quiz_id', params.id)
          .single();
          
        if (!resultError && resultData) {
          setQuizCompleted(true);
          setScore(resultData.score);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [router, params.id]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === questions[currentQuestion].correct_answer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    // Update user answers
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateAndSaveScore();
    }
  };

  const calculateAndSaveScore = async () => {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index].correct_answer
    ).length;
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
    
    // Save quiz result to database
    if (user && quiz) {
      try {
        const { error } = await supabase
          .from('quiz_results')
          .upsert({
            user_id: user.id,
            quiz_id: quiz.id,
            score: finalScore,
            answers: userAnswers,
            completed_at: new Date().toISOString(),
          });
          
        if (error) throw error;
      } catch (error) {
        console.error('Error saving quiz results:', error);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setUserAnswers(new Array(questions.length).fill(null));
    setQuizCompleted(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!quiz || !questions.length) {
    return (
      <PageContainer
        title="Quiz Not Found"
        description="The requested quiz could not be found."
        user={user}
        showDashboardLink
      >
        <div className="text-center py-10">
          <p className="text-gray-600 mb-6">
            Sorry, the quiz you're looking for doesn't exist or has been removed.
          </p>
          <LinkButton href="/quizzes">
            Back to Quizzes
          </LinkButton>
        </div>
      </PageContainer>
    );
  }

  if (quizCompleted) {
    return (
      <PageContainer
        title={quiz.title}
        user={user}
        showDashboardLink
      >
        <Card className="max-w-2xl mx-auto text-center py-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h3>
          <p className="text-gray-600 mb-6">Your score:</p>
          
          <div className="mb-8">
            <div className="text-6xl font-bold text-amber-700 mb-2">{score}%</div>
            <p className="text-gray-600">
              You answered {userAnswers.filter((answer, index) => answer === questions[index].correct_answer).length} out of {questions.length} questions correctly.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Button onClick={handleRestartQuiz} variant="primary">
                Take Quiz Again
              </Button>
            </div>
            <div>
              <LinkButton href="/quizzes" variant="outline">
                Back to Quizzes
              </LinkButton>
            </div>
          </div>
        </Card>
      </PageContainer>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <PageContainer
      title={quiz.title}
      user={user}
      showDashboardLink
    >
      <Card className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <ProgressBar progress={progress} height="sm" showPercentage={false} />
        </div>
        
        {/* Question */}
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {question.question}
        </h3>
        
        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left p-4 border rounded-lg transition ${
                selectedOption === index
                  ? 'border-amber-700 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              } ${
                showExplanation && index === question.correct_answer
                  ? 'border-green-500 bg-green-50'
                  : showExplanation && index === selectedOption && index !== question.correct_answer
                  ? 'border-red-500 bg-red-50'
                  : ''
              }`}
              onClick={() => !showExplanation && handleOptionSelect(index)}
              disabled={showExplanation}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                  selectedOption === index
                    ? 'border-amber-700 bg-amber-700 text-white'
                    : 'border-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <div>{option}</div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-2`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-gray-700">{question.explanation}</p>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between">
          {!showExplanation ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              variant={selectedOption === null ? 'outline' : 'primary'}
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}