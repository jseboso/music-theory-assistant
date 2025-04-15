"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { LinkButton } from '@/components/ui/Button';

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: number;
  questions_count: number;
  completed?: boolean;
  score?: number;
}

export default function QuizzesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [difficulty, setDifficulty] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        router.push('/login');
        return;
      }
      
      setUser(data.user);
      
      // Fetch quizzes
      try {
        const { data: quizzesData, error } = await supabase
          .from('quizzes')
          .select('*')
          .order('id', { ascending: true });
          
        if (error) throw error;
        
        setQuizzes(quizzesData || []);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <Loading />;
  }

  const filteredQuizzes = difficulty === 'all'
    ? quizzes
    : quizzes.filter(quiz => quiz.difficulty === difficulty);

  return (
    <PageContainer
      title="Music Theory Quizzes"
      description="Test your knowledge with our interactive quizzes."
      user={user}
      onSignOut={handleSignOut}
    >
      {/* Difficulty Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={difficulty === 'all' ? 'primary' : 'outline'}
            onClick={() => setDifficulty('all')}
          >
            All Levels
          </Button>
          <Button
            variant={difficulty === 'beginner' ? 'primary' : 'outline'}
            onClick={() => setDifficulty('beginner')}
          >
            Beginner
          </Button>
          <Button
            variant={difficulty === 'intermediate' ? 'primary' : 'outline'}
            onClick={() => setDifficulty('intermediate')}
          >
            Intermediate
          </Button>
          <Button
            variant={difficulty === 'advanced' ? 'primary' : 'outline'}
            onClick={() => setDifficulty('advanced')}
          >
            Advanced
          </Button>
        </div>
      </div>
      
      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} highlightBar>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h4>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  quiz.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                  {quiz.questions_count} questions
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                  {quiz.estimated_time} min
                </span>
              </div>
              
              {quiz.completed && (
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your score</span>
                    <span className="text-sm font-medium text-amber-700">{quiz.score}%</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <LinkButton href={`/quizzes/${quiz.id}`}>
                  {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                </LinkButton>
              </div>
            </Card>
          ))
        ) : (
          <div className="md:col-span-3 text-center p-8">
            <p className="text-gray-600">No quizzes found for this difficulty level.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}