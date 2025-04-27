import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>Hello</p>
      </Card>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('only shows the highlight bar when highlightBar is set', () => {
    const { container, rerender } = render(<Card>content</Card>);
    expect(container.querySelector('.bg-amber-700')).not.toBeInTheDocument();

    rerender(<Card highlightBar>content</Card>);
    expect(container.querySelector('.bg-amber-700')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>content</Card>);

    fireEvent.click(screen.getByText('content'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
