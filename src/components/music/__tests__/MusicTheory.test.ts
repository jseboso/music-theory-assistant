import { describe, it, expect } from '@jest/globals';
import {
  noteOptions,
  getNoteIndex,
  calculateScaleNotes,
  calculateChordNotes,
  getIntervalNote,
  getRandomNote,
  getScaleDegreeNames,
  getRomanNumerals,
  getNoteWithOctave,
} from '../MusicTheory';

describe('getNoteIndex', () => {
  it('finds the chromatic index of a known note', () => {
    expect(getNoteIndex('C')).toBe(0);
    expect(getNoteIndex('G')).toBe(7);
    expect(getNoteIndex('B')).toBe(11);
  });

  it('returns -1 for a note that is not in the chromatic scale', () => {
    expect(getNoteIndex('H')).toBe(-1);
  });
});

describe('calculateScaleNotes', () => {
  it('builds the C major scale', () => {
    expect(calculateScaleNotes('C', 'major')).toEqual([
      'C', 'D', 'E', 'F', 'G', 'A', 'B',
    ]);
  });

  it('builds the A natural minor scale', () => {
    expect(calculateScaleNotes('A', 'minor')).toEqual([
      'A', 'B', 'C', 'D', 'E', 'F', 'G',
    ]);
  });

  it('wraps chromatic intervals past B back around to C', () => {
    // G major: G A B C D E F#
    expect(calculateScaleNotes('G', 'major')).toEqual([
      'G', 'A', 'B', 'C', 'D', 'E', 'F#',
    ]);
  });

  it('returns an empty array for an unknown scale id', () => {
    expect(calculateScaleNotes('C', 'not-a-real-scale')).toEqual([]);
  });
});

describe('calculateChordNotes', () => {
  it('builds a major triad', () => {
    expect(calculateChordNotes('C', 'major')).toEqual(['C', 'E', 'G']);
  });

  it('builds a minor 7th chord', () => {
    expect(calculateChordNotes('C', 'min7')).toEqual(['C', 'D#', 'G', 'A#']);
  });

  it('builds a dominant 7th chord that wraps around the octave', () => {
    expect(calculateChordNotes('G', 'dom7')).toEqual(['G', 'B', 'D', 'F']);
  });

  it('returns an empty array for an unknown chord id', () => {
    expect(calculateChordNotes('C', 'not-a-real-chord')).toEqual([]);
  });
});

describe('getIntervalNote', () => {
  it('finds a note within the same octave', () => {
    expect(getIntervalNote('C4', 'Major 3rd')).toBe('E4');
  });

  it('bumps the octave when the interval crosses B->C', () => {
    expect(getIntervalNote('A4', 'Minor 3rd')).toBe('C5');
  });

  it('treats a full octave interval as landing on the same note, one octave up', () => {
    expect(getIntervalNote('C4', 'Octave')).toBe('C5');
  });

  it('defaults to an octave of 4 when no octave is given', () => {
    expect(getIntervalNote('C', 'Perfect 5th')).toBe('G4');
  });
});

describe('getRandomNote', () => {
  it('always returns a note from the chromatic scale and octave range provided', () => {
    for (let i = 0; i < 25; i++) {
      const note = getRandomNote([2, 3]);
      const match = note.match(/^([A-G]#?)(\d)$/);
      expect(match).not.toBeNull();
      const [, pitch, octave] = match as RegExpMatchArray;
      expect(noteOptions).toContain(pitch);
      expect(['2', '3']).toContain(octave);
    }
  });
});

describe('getScaleDegreeNames', () => {
  it('names the degrees of a major-family scale', () => {
    expect(getScaleDegreeNames('major')).toEqual([
      'Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone',
    ]);
  });

  it('uses scale-degree numbers for the pentatonic scales', () => {
    expect(getScaleDegreeNames('pentatonic_major')).toEqual(['1', '2', '3', '4', '5']);
  });

  it('uses flat-degree notation for the blues scale', () => {
    expect(getScaleDegreeNames('blues')).toEqual(['1', '♭3', '4', '♭5', '5', '♭7']);
  });

  it('falls back to plain numbering for scales with no named degrees', () => {
    expect(getScaleDegreeNames('whole_tone')).toEqual(['1', '2', '3', '4', '5', '6']);
  });
});

describe('getRomanNumerals', () => {
  it('gives major-key roman numerals', () => {
    expect(getRomanNumerals('major')).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
  });

  it('gives harmonic-minor roman numerals with a raised leading tone', () => {
    expect(getRomanNumerals('harmonic_minor')).toEqual([
      'i', 'ii°', '♭III', 'iv', 'V', '♭VI', 'vii°',
    ]);
  });

  it('falls back to blank numerals for scales without a defined set', () => {
    expect(getRomanNumerals('whole_tone')).toEqual(['', '', '', '', '', '']);
  });
});

describe('getNoteWithOctave', () => {
  it('replaces the octave on a note that already has one', () => {
    expect(getNoteWithOctave('C4', 5)).toBe('C5');
    expect(getNoteWithOctave('C#4', 3)).toBe('C#3');
  });

  it('appends an octave to a bare note name', () => {
    expect(getNoteWithOctave('D', 2)).toBe('D2');
  });
});
