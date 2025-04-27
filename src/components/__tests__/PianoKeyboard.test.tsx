import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import PianoKeyboard from '../PianoKeyboard';

describe('PianoKeyboard', () => {
  it('highlights a bare note name (no octave) in every rendered octave', () => {
    const { getByText } = render(
      <PianoKeyboard activeNotes={['C']} startOctave={3} endOctave={4} />
    );

    expect(getByText('C3').closest('.piano-key')).toHaveClass('bg-amber-200');
    expect(getByText('C4').closest('.piano-key')).toHaveClass('bg-amber-200');
  });

  it('leaves notes that were not requested unhighlighted', () => {
    const { getByText } = render(
      <PianoKeyboard activeNotes={['C']} startOctave={3} endOctave={3} />
    );

    expect(getByText('D').closest('.piano-key')).toHaveClass('bg-white');
  });

  it('highlights a fully-qualified note only in its own octave', () => {
    const { container } = render(
      <PianoKeyboard activeNotes={['C#4']} startOctave={3} endOctave={4} />
    );

    const blackKeys = Array.from(container.querySelectorAll('.black-key'));
    const activeBlackKeys = blackKeys.filter((el) =>
      el.classList.contains('bg-amber-600')
    );

    expect(activeBlackKeys).toHaveLength(1);
  });

  it('hides key labels when showLabels is false', () => {
    const { queryByText } = render(
      <PianoKeyboard activeNotes={[]} startOctave={3} endOctave={3} showLabels={false} />
    );

    expect(queryByText('C3')).not.toBeInTheDocument();
  });

  it('renders one octave worth of white and black keys', () => {
    const { container } = render(
      <PianoKeyboard activeNotes={[]} startOctave={4} endOctave={4} />
    );

    expect(container.querySelectorAll('.white-key')).toHaveLength(7);
    expect(container.querySelectorAll('.black-key')).toHaveLength(5);
  });
});
