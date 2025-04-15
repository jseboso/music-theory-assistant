// home
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <header className="bg-amber-700 text-white shadow-md">
        <div className="container mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <h1 className="text-3xl font-bold">Music Theory Assistant</h1>
          </div>
          <Link 
            href="/login" 
            className="px-4 py-2 bg-white text-amber-700 rounded-lg hover:bg-amber-50 transition font-medium"
          >
            Login
          </Link>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Learn Music Theory the Easy Way
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                A simple, interactive platform to help you understand music theory concepts, 
                practice your skills, and track your progress.
              </p>
              <Link 
                href="/login" 
                className="px-8 py-4 bg-amber-700 text-white rounded-lg hover:bg-amber-800 text-lg font-medium transition shadow-lg"
              >
                Start Learning
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">Interactive Lessons</h3>
                <p className="text-black">
                  Learn music theory concepts through engaging, interactive content designed for all skill levels.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">Ear Training</h3>
                <p className="text-black">
                  Develop your musical ear with exercises designed to improve your listening skills.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">Progress Tracking</h3>
                <p className="text-black">
                  Track your learning journey and see your improvement over time with our progress system.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 bg-amber-700 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to improve your music theory skills?</h2>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-white text-amber-700 rounded-lg hover:bg-amber-50 text-lg font-medium inline-block shadow-lg"
            >
              Login to Get Started
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <h3 className="text-lg font-bold">Music Theory Assistant</h3>
          </div>
          <p className="text-gray-400">&copy; 2025 Music Theory Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}