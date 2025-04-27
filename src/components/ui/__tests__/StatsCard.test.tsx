import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
  it('renders the title and value', () => {
    render(<StatsCard title="Lessons Completed" value={12} />);
    expect(screen.getByText('Lessons Completed')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders an optional subtitle', () => {
    render(<StatsCard title="Streak" value="5 days" subtitle="Keep it up!" />);
    expect(screen.getByText('Keep it up!')).toBeInTheDocument();
  });

  it('omits the subtitle when none is given', () => {
    const { container } = render(<StatsCard title="Streak" value="5 days" />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });
});
