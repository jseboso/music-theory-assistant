"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import LessonCard from '@/components/LessonCard';

export default function LessonsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        router.push('/login');
        return;
      }
      
      setUser(data.user);
      
      try {
        const { data: lessonsData, error } = await supabase
          .from('lessons')
          .select('*')
          .order('order_number', { ascending: true });
          
        if (error) throw error;
        
        const lessonData = lessonsData || [];
        setLessons(lessonData);
        
        const uniqueCategories = Array.from(
          new Set(lessonData.map(lesson => lesson.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching lessons:', error);
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

  const filteredLessons = selectedCategory === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.category === selectedCategory);

  return (
    <PageContainer
      title="Music Theory Lessons"
      description="Explore our comprehensive music theory curriculum."
      user={user}
      onSignOut={handleSignOut}
    >
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All Lessons
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))
        ) : (
          <div className="md:col-span-3 text-center p-8">
            <p className="text-gray-600">No lessons found in this category.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}