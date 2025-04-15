"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button, LinkButton } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface LessonParams {
  params: {
    id: string;
  };
}

export default function LessonPage({ params }: LessonParams) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        router.push('/login');
        return;
      }
      
      setUser(data.user);
      
      // Fetch lesson data
      try {
        const { data: lessonData, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (error) throw error;
        
        setLesson(lessonData);
        
        // Fetch user's progress for this lesson
        const { data: progressData, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('lesson_id', params.id)
          .single();
          
        if (!progressError && progressData) {
          setProgress(progressData.progress);
          setCurrentSection(progressData.current_section);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [router, params.id]);

  const updateProgress = async (newSection: number, newProgress: number) => {
    if (!user || !lesson) return;
    
    // Update progress in state
    setCurrentSection(newSection);
    setProgress(newProgress);
    
    // Update progress in database
    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          current_section: newSection,
          progress: newProgress,
          last_updated: new Date().toISOString(),
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNextSection = () => {
    if (!lesson || !lesson.content) return;
    
    const totalSections = lesson.content.length;
    const newSection = Math.min(currentSection + 1, totalSections - 1);
    const newProgress = Math.round((newSection / (totalSections - 1)) * 100);
    
    updateProgress(newSection, newProgress);
  };

  const handlePreviousSection = () => {
    if (!lesson) return;
    
    const newSection = Math.max(currentSection - 1, 0);
    const totalSections = lesson.content.length;
    const newProgress = Math.round((newSection / (totalSections - 1)) * 100);
    
    updateProgress(newSection, newProgress);
  };

  const handleCompleteLesson = async () => {
    if (!user || !lesson) return;
    
    try {
      // Mark lesson as completed
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          current_section: lesson.content.length - 1,
          progress: 100,
          completed: true,
          last_updated: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      // Redirect to quiz if available
      if (lesson.quiz_id) {
        router.push(`/quizzes/${lesson.quiz_id}`);
      } else {
        router.push('/lessons');
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!lesson) {
    return (
      <PageContainer
        title="Lesson Not Found"
        description="The requested lesson could not be found."
        user={user}
        showDashboardLink
      >
        <div className="text-center py-10">
          <p className="text-gray-600 mb-6">
            Sorry, the lesson you're looking for doesn't exist or has been removed.
          </p>
          <LinkButton href="/lessons">
            Back to Lessons
          </LinkButton>
        </div>
      </PageContainer>
    );
  }

  const currentContent = lesson.content?.[currentSection] || { title: '', body: '' };
  
  return (
    <PageContainer
      title={lesson.title}
      user={user}
      showDashboardLink
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3">
          <Card>
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">
                  Section {currentSection + 1} of {lesson.content?.length}
                </p>
                <p className="text-sm text-gray-600">
                  {progress}% Complete
                </p>
              </div>
              <ProgressBar progress={progress} height="sm" showPercentage={false} />
            </div>
            
            {/* Section title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {currentContent.title}
            </h3>
            
            {/* Section content */}
            <div 
              className="prose max-w-none mb-8" 
              dangerouslySetInnerHTML={{ __html: currentContent.body }}
            />
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePreviousSection}
                disabled={currentSection === 0}
                variant={currentSection === 0 ? "outline" : "secondary"}
              >
                Previous
              </Button>
              
              {currentSection < (lesson.content?.length - 1) ? (
                <Button onClick={handleNextSection}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleCompleteLesson}>
                  {lesson.quiz_id ? 'Take Quiz' : 'Complete Lesson'}
                </Button>
              )}
            </div>
          </Card>
        </div>
        
        <div>
          <div className="sticky top-6">
            <Card>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Lesson Outline</h3>
              
              <ul className="space-y-2">
                {lesson.content?.map((section: any, index: number) => (
                  <li key={index}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        index === currentSection
                          ? 'bg-amber-100 text-amber-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        const totalSections = lesson.content.length;
                        const newProgress = Math.round((index / (totalSections - 1)) * 100);
                        updateProgress(index, newProgress);
                      }}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">
                  {lesson.duration} minute lesson
                </h4>
                
                {lesson.resources && lesson.resources.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Resources</h4>
                    <ul className="space-y-1">
                      {lesson.resources.map((resource: any, index: number) => (
                        <li key={index}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 hover:text-amber-600 text-sm"
                          >
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}