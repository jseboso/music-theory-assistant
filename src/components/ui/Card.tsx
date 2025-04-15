import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  highlightBar?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', highlightBar = false, onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-lg transition' : ''} ${className}`}
      onClick={onClick}
    >
      {highlightBar && <div className="h-3 bg-amber-700"></div>}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}