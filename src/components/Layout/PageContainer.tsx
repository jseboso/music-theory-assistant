import { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

interface PageContainerProps {
  children: ReactNode;
  title: string;
  description?: string;
  user?: any;
  onSignOut?: () => void;
  showDashboardLink?: boolean;
}

export function PageContainer({ 
  children, 
  title, 
  description, 
  user, 
  onSignOut,
  showDashboardLink = false 
}: PageContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <AppHeader user={user} onSignOut={onSignOut} showDashboardLink={showDashboardLink} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        
        {children}
      </main>
      
      <AppFooter />
    </div>
  );
}