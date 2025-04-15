interface ProgressBarProps {
    progress: number;
    showPercentage?: boolean;
    height?: 'sm' | 'md' | 'lg';
  }
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  
  export function ProgressBar({ progress, showPercentage = true, height = 'md' }: ProgressBarProps) {
    const percentage = Math.round(progress);
    
    return (
      <div>
        <div className={`w-full bg-gray-200 rounded-full ${heightClasses[height]} dark:bg-gray-700`}>
          <div 
            className={`bg-amber-700 ${heightClasses[height]} rounded-full`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <p className="text-gray-600 mt-2">
            {percentage}% Complete
          </p>
        )}
      </div>
    );
  }