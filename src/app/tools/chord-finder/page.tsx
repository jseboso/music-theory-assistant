"use client";

import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import PianoKeyboard from '@/components/PianoKeyboard';
import { 
  noteOptions, 
  chordTypes, 
  calculateChordNotes, 
  getNoteWithOctave 
} from '@/components/music/MusicTheory';
import { useAudio, AudioProvider } from '@/components/music/AudioContext';

function ChordFinderContent() {
  const [selectedRoot, setSelectedRoot] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [chordNotes, setChordNotes] = useState<string[]>([]);
  const [activeChordNotes, setActiveChordNotes] = useState<string[]>([]);
  const [octave, setOctave] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { initializeTone, playChord, isAudioInitialized, createPolySynth } = useAudio();

  useEffect(() => {
    initializeTone();
  }, [initializeTone]);

  useEffect(() => {
    if (selectedRoot && selectedType) {
      const notes = calculateChordNotes(selectedRoot, selectedType);
      setChordNotes(notes);
    } else {
      setChordNotes([]);
    }
  }, [selectedRoot, selectedType]);

  const playChordSound = async () => {
    if (!isAudioInitialized || chordNotes.length === 0) return;
    
    setIsPlaying(true);
    
    const notesWithOctave = chordNotes.map(note => getNoteWithOctave(note, octave));
    
    setActiveChordNotes(chordNotes);
    
    playChord(notesWithOctave, "2n");
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const playArpeggio = async () => {
    if (!isAudioInitialized || chordNotes.length === 0) return;
    
    setIsPlaying(true);
    
    const notesWithOctave = chordNotes.map(note => getNoteWithOctave(note, octave));
    
    setActiveChordNotes(chordNotes);
    
    const polySynth = createPolySynth();
    const now = Tone.now();
    notesWithOctave.forEach((note, index) => {
      polySynth.triggerAttackRelease(note, "8n", now + index * 0.25);
    });
    
    setTimeout(() => {
      setIsPlaying(false);
      polySynth.dispose();
    }, notesWithOctave.length * 250 + 500);
  };
  
  const clearActiveNotes = () => {
    setActiveChordNotes([]);
  };

  const getChordDescription = (chordId: string): string => {
    switch (chordId) {
      case 'major':
        return 'The major chord has a bright, happy sound. It consists of the root, major third, and perfect fifth.';
      case 'minor':
        return 'The minor chord has a darker, sadder sound. It consists of the root, minor third, and perfect fifth.';
      case 'diminished':
        return 'The diminished chord has a tense, unstable sound. It consists of the root, minor third, and diminished fifth.';
      case 'augmented':
        return 'The augmented chord has a mysterious, unsettled sound. It consists of the root, major third, and augmented fifth.';
      case 'sus2':
        return 'The suspended 2nd chord replaces the third with a second. It has an open, unresolved sound.';
      case 'sus4':
        return 'The suspended 4th chord replaces the third with a fourth. It has a floating, unresolved sound.';
      case 'maj7':
        return 'The major 7th chord adds a major seventh to the major triad. It has a smooth, jazzy quality.';
      case 'min7':
        return 'The minor 7th chord adds a minor seventh to the minor triad. It has a soft, melancholic quality.';
      case 'dom7':
        return 'The dominant 7th chord adds a minor seventh to the major triad. It creates tension that wants to resolve.';
      default:
        return '';
    }
  };

  const getChordUses = (chordId: string): string => {
    switch (chordId) {
      case 'major':
        return 'Used in countless songs across all genres. Often used for the I, IV, and V chords in major keys.';
      case 'minor':
        return 'Used extensively in all genres. Forms the i, iv, and v chords in minor keys.';
      case 'diminished':
        return 'Often used as a passing chord or to create tension before resolution.';
      case 'augmented':
        return 'Used to add color and tension, often as a transition between more stable chords.';
      case 'sus2':
        return 'Used to create an open sound or to delay resolution to a major or minor chord.';
      case 'sus4':
        return 'Commonly used before resolving to a major chord. Creates a sense of anticipation.';
      case 'maj7':
        return 'Common in jazz, R&B, and contemporary pop. Creates a sophisticated sound.';
      case 'min7':
        return 'Popular in jazz, soul, and R&B. Creates a relaxed, slightly sad atmosphere.';
      case 'dom7':
        return 'Classic V7 chord that strongly wants to resolve to the I chord.';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Select Chord</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Root Note</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {noteOptions.map((note) => (
                <Button
                  key={note}
                  variant={selectedRoot === note ? 'primary' : 'outline'}
                  onClick={() => setSelectedRoot(note)}
                >
                  {note}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Chord Type</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {chordTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
          
          {chordNotes.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Chord Notes</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {chordNotes.map((note, index) => (
                  <div key={index} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium">
                    {note}
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Octave</h4>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setOctave(Math.max(2, octave - 1))}
                    variant="outline"
                    disabled={octave <= 2}
                  >
                    -
                  </Button>
                  <span className="font-medium text-lg text-black">{octave}</span>
                  <Button
                    onClick={() => setOctave(Math.min(6, octave + 1))}
                    variant="outline"
                    disabled={octave >= 6}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Piano Keyboard</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <PianoKeyboard 
                    activeNotes={activeChordNotes} 
                    startOctave={octave} 
                    endOctave={octave} 
                  />
                </div>
                {activeChordNotes.length > 0 && (
                  <button
                    onClick={clearActiveNotes}
                    className="mt-3 text-amber-700 hover:text-amber-600 font-medium"
                  >
                    Clear Highlighted Notes
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={playChordSound}
                  disabled={isPlaying}
                >
                  Play Chord
                </Button>
                <Button
                  onClick={playArpeggio}
                  disabled={isPlaying}
                >
                  Play Arpeggio
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      <div>
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Chord Theory</h3>
          
          {selectedType ? (
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                {chordTypes.find(type => type.id === selectedType)?.name} Chord
              </h4>
              <p className="text-gray-600 mb-4">
                {getChordDescription(selectedType)}
              </p>
              
              <h4 className="text-lg font-medium text-gray-700 mb-2">Common Uses</h4>
              <p className="text-gray-600">
                {getChordUses(selectedType)}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">
              Select a chord type to see its music theory explanation.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

import * as Tone from 'tone';

export default function ChordFinderTool() {
  return (
    <AudioProvider>
      <PageContainer
        title="Chord Finder"
        description="Explore different chord types and hear how they sound."
        showDashboardLink
      >
        <ChordFinderContent />
      </PageContainer>
    </AudioProvider>
  );
}