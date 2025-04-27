"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { PageContainer } from '@/components/Layout/PageContainer';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import LessonCard from '@/components/LessonCard';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<any[]>([]);
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
        
        setLessons(lessonsData || []);
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

  // Sample data for progress stats
  const progressStats = {
    lessonsCompleted: 3,
    totalLessons: lessons.length,
    streakDays: 5,
    lastActivity: '2 days ago'
  };

  const recentActivities = [
    { id: 1, type: 'Lesson Completed', name: 'Introduction to Musical Notes', date: 'Yesterday' },
    { id: 2, type: 'Quiz Passed', name: 'Identifying Major Scales', date: '3 days ago' },
    { id: 3, type: 'Started Lesson', name: 'Understanding Chord Progressions', date: '5 days ago' }
  ];

  return (
    <PageContainer
      title={`Welcome back, ${user?.email?.split('@')[0]}!`}
      description="Continue your music theory journey where you left off."
      user={user}
      onSignOut={handleSignOut}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Lessons Completed" 
          value={`${progressStats.lessonsCompleted}/${progressStats.totalLessons}`} 
        />
        
        <StatsCard 
          title="Current Streak" 
          value={`${progressStats.streakDays} days`} 
        />
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Progress</h3>
          <ProgressBar 
            progress={(progressStats.lessonsCompleted / progressStats.totalLessons) * 100} 
          />
        </div>
        
        <StatsCard 
          title="Last Activity" 
          value={progressStats.lastActivity} 
        />
      </div>
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Continue Learning</h3>
          <Link href="/lessons" className="text-amber-700 hover:text-amber-600 font-medium">
            View All Lessons
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lessons.slice(0, 3).map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
      
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
        
        <Card>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-amber-700">{activity.type}</span>
                    <h4 className="text-lg font-semibold text-gray-800">{activity.name}</h4>
                  </div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Access Tools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              href: "/tools/ear-training",
              icon: <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>,
              title: "Ear Training",
              description: "Practice identifying notes, intervals, and chords by ear."
            },
            {
              href: "/tools/metronome",
              icon: <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>,
              title: "Metronome",
              description: "Keep time with our adjustable metronome tool."
            },
            {
              href: "/tools/chord-finder",
              icon: <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>,
              title: "Chord Finder",
              description: "Discover chord structures and voicings."
            },
            {
              href: "/tools/scale-explorer",
              icon: <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a2.5 2.5 0 015 0v6a2.5 2.5 0 010 5v6a2.5 2.5 0 11-5 0v-6a2.5 2.5 0 010-5z" />
              </svg>,
              title: "Scale Explorer",
              description: "Learn and explore different musical scales."
            },
          ].map((tool, index) => (
            <Link 
              key={index}
              href={tool.href} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                {tool.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{tool.title}</h4>
              <p className="text-gray-600 mt-2">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}