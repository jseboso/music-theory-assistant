import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('rounds and displays the percentage by default', () => {
    render(<ProgressBar progress={42.6} />);
    expect(screen.getByText('43% Complete')).toBeInTheDocument();
  });

  it('can hide the percentage label', () => {
    render(<ProgressBar progress={50} showPercentage={false} />);
    expect(screen.queryByText(/Complete/)).not.toBeInTheDocument();
  });

  it('sets the filled bar width from the progress value', () => {
    const { container } = render(<ProgressBar progress={75} />);
    const fill = container.querySelector('.bg-amber-700');
    expect(fill).toHaveStyle({ width: '75%' });
  });
});
