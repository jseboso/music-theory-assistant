import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import LessonCard from '../LessonCard';

const baseLesson = {
  id: 'scales-101',
  title: 'Intro to Scales',
  description: 'Learn the building blocks of scales.',
  duration: 15,
};

describe('LessonCard', () => {
  it('links to the lesson and shows its duration', () => {
    render(<LessonCard lesson={baseLesson} />);

    const link = screen.getByRole('link', { name: 'Continue' });
    expect(link).toHaveAttribute('href', '/lessons/scales-101');
    expect(screen.getByText('15 minutes')).toBeInTheDocument();
  });

  it('labels a completed lesson "Review" instead of "Continue"', () => {
    render(<LessonCard lesson={{ ...baseLesson, completed: true }} />);
    expect(screen.getByRole('link', { name: 'Review' })).toBeInTheDocument();
  });

  it('only renders a progress bar when progress is provided', () => {
    const { container, rerender } = render(<LessonCard lesson={baseLesson} />);
    expect(container.querySelector('.bg-amber-700.h-2')).not.toBeInTheDocument();

    rerender(<LessonCard lesson={{ ...baseLesson, progress: 40 }} />);
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
