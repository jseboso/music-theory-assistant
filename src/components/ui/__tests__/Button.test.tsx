import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, LinkButton } from '../Button';

describe('Button', () => {
  it('renders its children and responds to clicks', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Play</Button>);

    const button = screen.getByRole('button', { name: 'Play' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and ignores clicks when disabled is set', () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Play
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Play' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('swaps variant classes', () => {
    const { rerender } = render(<Button variant="primary">Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-amber-700');

    rerender(<Button variant="outline">Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-gray-300');
  });
});

describe('LinkButton', () => {
  it('renders a link pointing at the given href', () => {
    render(<LinkButton href="/lessons/1">Continue</LinkButton>);

    const link = screen.getByRole('link', { name: 'Continue' });
    expect(link).toHaveAttribute('href', '/lessons/1');
  });
});
