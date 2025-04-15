"use client";

import React from 'react';

interface PianoKeyboardProps {
  activeNotes: string[];
  startOctave?: number;
  endOctave?: number;
  showLabels?: boolean;
}

export default function PianoKeyboard({ 
  activeNotes, 
  startOctave = 3, 
  endOctave = 5,
  showLabels = true
}: PianoKeyboardProps) {
  const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const normalizedActiveNotes = activeNotes.map(note => {
    if (/[A-G]#?\d/.test(note)) {
      return note;
    }
    return `${note}4`;
  });
  
  const generateKeys = () => {
    const keys = [];
    
    for (let octave = startOctave; octave <= endOctave; octave++) {
      allNotes.forEach(note => {
        const fullNote = `${note}${octave}`;
        const isSharp = note.includes('#');

        const isActive = 
          normalizedActiveNotes.includes(fullNote) || 
          activeNotes.includes(note);
        
        keys.push({
          note,
          fullNote,
          isSharp,
          isActive,
          octave
        });
      });
    }
    
    return keys;
  };

  const keys = generateKeys();
  
  const getKeyLabel = (key: {note: string, octave: number}) => {
    const displayNote = key.note.replace('#', '');
    
    const shouldShowOctave = key.note === 'C' && showLabels;
    
    return `${displayNote}${shouldShowOctave ? key.octave : ''}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative piano-container" style={{ 
        height: '160px', 
        minWidth: `${((endOctave - startOctave + 1) * 7) * 40}px` 
      }}>
        {/* White keys */}
        <div className="flex absolute top-0 left-0 right-0 h-full">
          {keys.filter(key => !key.isSharp).map((key, index) => (
            <div
              key={`${key.fullNote}-${index}`}
              className={`piano-key white-key border border-gray-300 ${
                key.isActive ? 'bg-amber-200' : 'bg-white'
              }`}
              style={{
                width: '40px',
                height: '100%',
                position: 'relative'
              }}
            >
              {showLabels && (
                <span className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-600">
                  {getKeyLabel(key)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Black keys */}
        <div className="flex absolute top-0 left-0 right-0">
          {keys.map((key, index) => {
            if (!key.isSharp) return null;
            
            const noteIndex = allNotes.indexOf(key.note.replace('#', ''));
            const octaveOffset = (key.octave - startOctave) * 7 * 40;
            
            let position;
            
            if (key.note === 'C#') position = 25 + octaveOffset;
            else if (key.note === 'D#') position = 65 + octaveOffset;
            else if (key.note === 'F#') position = 145 + octaveOffset;
            else if (key.note === 'G#') position = 185 + octaveOffset;
            else if (key.note === 'A#') position = 225 + octaveOffset;
            else position = 0;
            
            return (
              <div
                key={`${key.fullNote}-${index}`}
                className={`piano-key black-key ${
                  key.isActive ? 'bg-amber-600' : 'bg-black'
                }`}
                style={{
                  width: '30px',
                  height: '100px',
                  position: 'absolute',
                  left: `${position}px`,
                  zIndex: 10
                }}
              >
                {showLabels && (
                  <span className="absolute bottom-2 left-0 right-0 text-center text-xs text-white">
                    {key.note}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}