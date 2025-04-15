interface ScaleType {
    id: string;
    name: string;
    formula: number[];
  }
  
  interface ChordType {
    id: string;
    name: string;
    formula: number[];
  }
  
  export const noteOptions = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ];
  
  export const scaleTypes: ScaleType[] = [
    { id: 'major', name: 'Major', formula: [0, 2, 4, 5, 7, 9, 11] },
    { id: 'minor', name: 'Natural Minor', formula: [0, 2, 3, 5, 7, 8, 10] },
    { id: 'harmonic_minor', name: 'Harmonic Minor', formula: [0, 2, 3, 5, 7, 8, 11] },
    { id: 'melodic_minor', name: 'Melodic Minor', formula: [0, 2, 3, 5, 7, 9, 11] },
    { id: 'dorian', name: 'Dorian', formula: [0, 2, 3, 5, 7, 9, 10] },
    { id: 'phrygian', name: 'Phrygian', formula: [0, 1, 3, 5, 7, 8, 10] },
    { id: 'lydian', name: 'Lydian', formula: [0, 2, 4, 6, 7, 9, 11] },
    { id: 'mixolydian', name: 'Mixolydian', formula: [0, 2, 4, 5, 7, 9, 10] },
    { id: 'locrian', name: 'Locrian', formula: [0, 1, 3, 5, 6, 8, 10] },
    { id: 'pentatonic_major', name: 'Major Pentatonic', formula: [0, 2, 4, 7, 9] },
    { id: 'pentatonic_minor', name: 'Minor Pentatonic', formula: [0, 3, 5, 7, 10] },
    { id: 'blues', name: 'Blues', formula: [0, 3, 5, 6, 7, 10] },
    { id: 'whole_tone', name: 'Whole Tone', formula: [0, 2, 4, 6, 8, 10] },
    { id: 'chromatic', name: 'Chromatic', formula: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  ];
  
  export const chordTypes: ChordType[] = [
    { id: 'major', name: 'Major', formula: [0, 4, 7] },
    { id: 'minor', name: 'Minor', formula: [0, 3, 7] },
    { id: 'diminished', name: 'Diminished', formula: [0, 3, 6] },
    { id: 'augmented', name: 'Augmented', formula: [0, 4, 8] },
    { id: 'sus2', name: 'Sus2', formula: [0, 2, 7] },
    { id: 'sus4', name: 'Sus4', formula: [0, 5, 7] },
    { id: 'maj7', name: 'Major 7th', formula: [0, 4, 7, 11] },
    { id: 'min7', name: 'Minor 7th', formula: [0, 3, 7, 10] },
    { id: 'dom7', name: 'Dominant 7th', formula: [0, 4, 7, 10] },
    { id: 'dim7', name: 'Diminished 7th', formula: [0, 3, 6, 9] },
    { id: 'hdim7', name: 'Half-Diminished 7th', formula: [0, 3, 6, 10] },
    { id: 'aug7', name: 'Augmented 7th', formula: [0, 4, 8, 10] },
    { id: 'maj9', name: 'Major 9th', formula: [0, 4, 7, 11, 14] },
    { id: 'min9', name: 'Minor 9th', formula: [0, 3, 7, 10, 14] },
    { id: 'dom9', name: 'Dominant 9th', formula: [0, 4, 7, 10, 14] },
  ];
  
  export const intervalOptions = [
    'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th',
    'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th',
    'Major 7th', 'Octave'
  ];
  
  export const getNoteIndex = (note: string): number => {
    return noteOptions.indexOf(note);
  };
  
  export const calculateScaleNotes = (root: string, scaleId: string): string[] => {
    const rootIndex = getNoteIndex(root);
    const scaleType = scaleTypes.find(type => type.id === scaleId);
    
    if (!scaleType) return [];
    
    return scaleType.formula.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return noteOptions[noteIndex];
    });
  };
  
  export const calculateChordNotes = (root: string, chordId: string): string[] => {
    const rootIndex = getNoteIndex(root);
    const chordType = chordTypes.find(type => type.id === chordId);
    
    if (!chordType) return [];
    
    return chordType.formula.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return noteOptions[noteIndex];
    });
  };
  
  export const getIntervalNote = (startNote: string, intervalName: string): string => {
    const intervals: Record<string, number> = {
      'Minor 2nd': 1,
      'Major 2nd': 2,
      'Minor 3rd': 3,
      'Major 3rd': 4,
      'Perfect 4th': 5,
      'Tritone': 6,
      'Perfect 5th': 7,
      'Minor 6th': 8,
      'Major 6th': 9,
      'Minor 7th': 10,
      'Major 7th': 11,
      'Octave': 12
    };
    
    const [noteName, octaveStr] = startNote.split(/(\d+)/);
    const octave = octaveStr ? parseInt(octaveStr) : 4;
    const startIndex = getNoteIndex(noteName);
    
    let interval = intervals[intervalName] || 0;
    let newIndex = (startIndex + interval) % 12;
    let newOctave = octave;
    
    if (startIndex + interval >= 12) {
      newOctave += Math.floor((startIndex + interval) / 12);
    }
    
    return `${noteOptions[newIndex]}${newOctave}`;
  };
  
  export const getRandomNote = (octaveRange: number[] = [3, 4, 5]): string => {
    const note = noteOptions[Math.floor(Math.random() * noteOptions.length)];
    const octave = octaveRange[Math.floor(Math.random() * octaveRange.length)];
    return `${note}${octave}`;
  };
  
  export const getScaleDegreeNames = (scaleId: string): string[] => {
    if (scaleId === 'major' || scaleId === 'lydian' || scaleId === 'mixolydian') {
      return ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone'];
    } else if (scaleId === 'minor' || scaleId === 'harmonic_minor' || scaleId === 'dorian' || scaleId === 'phrygian') {
      return ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Subtonic'];
    } else if (scaleId === 'pentatonic_major' || scaleId === 'pentatonic_minor') {
      return ['1', '2', '3', '4', '5'];
    } else if (scaleId === 'blues') {
      return ['1', '♭3', '4', '♭5', '5', '♭7'];
    } else {
      const scaleType = scaleTypes.find(type => type.id === scaleId);
      return scaleType ? Array.from({ length: scaleType.formula.length }, (_, i) => `${i + 1}`) : [];
    }
  };
  
  export const getRomanNumerals = (scaleId: string): string[] => {
    if (scaleId === 'major' || scaleId === 'lydian' || scaleId === 'mixolydian') {
      return ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    } else if (scaleId === 'minor' || scaleId === 'dorian' || scaleId === 'phrygian') {
      return ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'];
    } else if (scaleId === 'harmonic_minor') {
      return ['i', 'ii°', '♭III', 'iv', 'V', '♭VI', 'vii°'];
    } else {
      const scaleType = scaleTypes.find(type => type.id === scaleId);
      return scaleType ? Array.from({ length: scaleType.formula.length }, () => '') : [];
    }
  };
  
  export function getNoteWithOctave(note: string, octave: number): string {
    if (/[A-G]#?\d/.test(note)) {
      const noteName = note.replace(/\d+$/, '');
      return `${noteName}${octave}`;
    }
    return `${note}${octave}`;
  }