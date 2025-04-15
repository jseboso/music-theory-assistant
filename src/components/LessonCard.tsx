import { Card } from './ui/Card';
import { LinkButton } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    duration: number;
    completed?: boolean;
    progress?: number;
  };
}

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card highlightBar>
      <h4 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h4>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      
      {lesson.progress !== undefined && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div 
              className="bg-amber-700 h-2 rounded-full" 
              style={{ width: `${lesson.progress}%` }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-700">{lesson.progress}%</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {lesson.duration} minutes
        </span>
        <LinkButton
          href={`/lessons/${lesson.id}`}
          variant="primary"
          size="md"
        >
          {lesson.completed ? 'Review' : 'Continue'}
        </LinkButton>
      </div>
    </Card>
  );
}