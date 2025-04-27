"use client";

import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import PianoKeyboard from '@/components/PianoKeyboard';
import { useAudio, AudioProvider } from '@/components/music/AudioContext';
import { 
  noteOptions, 
  scaleTypes, 
  calculateScaleNotes, 
  getNoteWithOctave,
  getScaleDegreeNames,
  getRomanNumerals
} from '@/components/music/MusicTheory';

import * as Tone from 'tone';

function ScaleExplorerContent() {
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedScale, setSelectedScale] = useState<string>('major');
  const [scaleNotes, setScaleNotes] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [octave, setOctave] = useState(4);

  const { 
    initializeTone, 
    isAudioInitialized,
    createSynth
  } = useAudio();

  useEffect(() => {
    initializeTone();
  }, [initializeTone]);

  useEffect(() => {
    const notes = calculateScaleNotes(selectedRoot, selectedScale);
    setScaleNotes(notes);
  }, [selectedRoot, selectedScale]);

  const playScale = async () => {
    if (!isAudioInitialized || scaleNotes.length === 0) return;
    
    setIsPlaying(true);
    
    const notesWithOctave = [...scaleNotes, scaleNotes[0]].map((note, index) => {
      const adjustedOctave = index === scaleNotes.length ? octave + 1 : octave;
      return getNoteWithOctave(note, adjustedOctave);
    });
    
    const now = Tone.now();
    const synth = createSynth();
    notesWithOctave.forEach((note, index) => {
      synth.triggerAttackRelease(note, "8n", now + index * 0.25);
    });
    
    setTimeout(() => {
      setIsPlaying(false);
      synth.dispose();
    }, notesWithOctave.length * 250 + 500);
  };

  const playDescendingScale = async () => {
    if (!isAudioInitialized || scaleNotes.length === 0) return;
    
    setIsPlaying(true);
    
    const notesWithOctave = [scaleNotes[0], ...scaleNotes.slice().reverse()].map((note, index) => {
      const adjustedOctave = index === 0 ? octave + 1 : octave;
      return getNoteWithOctave(note, adjustedOctave);
    });
    
    const now = Tone.now();
    const synth = createSynth();
    notesWithOctave.forEach((note, index) => {
      synth.triggerAttackRelease(note, "8n", now + index * 0.25);
    });
    
    setTimeout(() => {
      setIsPlaying(false);
      synth.dispose();
    }, notesWithOctave.length * 250 + 500);
  };

  const getScaleDescription = (scaleId: string): string => {
    switch (scaleId) {
      case 'major':
        return 'The major scale is the most common scale in Western music. It has a bright, happy sound and is the foundation for major keys.';
      case 'minor':
        return "The natural minor scale has a darker, sadder sound compared to the major scale. It's the foundation for minor keys.";
      case 'harmonic_minor':
        return 'The harmonic minor scale raises the 7th note of the natural minor scale to create a stronger pull to the tonic.';
      case 'melodic_minor':
        return 'The melodic minor scale raises both the 6th and 7th notes of the natural minor scale when ascending, but returns to natural minor when descending.';
      case 'dorian':
        return 'The Dorian mode has a minor quality with a raised 6th degree. It has a jazzy, slightly less dark sound than natural minor.';
      case 'phrygian':
        return 'The Phrygian mode has a minor quality with a lowered 2nd degree, giving it a Spanish or exotic flavor.';
      case 'lydian':
        return 'The Lydian mode is like a major scale with a raised 4th degree, giving it a dreamy, floating quality.';
      case 'mixolydian':
        return 'The Mixolydian mode is like a major scale with a lowered 7th degree. It has a bluesy, dominant sound.';
      case 'locrian':
        return "The Locrian mode is the most dissonant mode, with a diminished 5th degree. It's rarely used as the main scale for a piece.";
      case 'pentatonic_major':
        return 'The major pentatonic scale uses five notes from the major scale, creating a simple, pleasing sound without semitones.';
      case 'pentatonic_minor':
        return 'The minor pentatonic scale uses five notes from the natural minor scale and is extremely common in blues, rock, and many world music traditions.';
      case 'blues':
        return 'The blues scale adds the "blue note" (♭5) to the minor pentatonic scale, creating that characteristic blues sound.';
      case 'whole_tone':
        return 'The whole tone scale consists entirely of whole steps, creating an ambiguous, floating sound with no clear tonal center.';
      case 'chromatic':
        return 'The chromatic scale includes all 12 semitones in an octave. It contains every possible note in Western music.';
      default:
        return '';
    }
  };

  const getScaleUses = (scaleId: string): string => {
    switch (scaleId) {
      case 'major':
        return 'Used in countless classical, pop, folk, and rock songs. Most Western music is built on major scales.';
      case 'minor':
        return 'Used extensively in classical, rock, metal, and emotional ballads to express sadness, intensity, or drama.';
      case 'harmonic_minor':
        return 'Common in classical music, flamenco, and metal. Creates tension and a distinctly Middle Eastern or Eastern European sound.';
      case 'melodic_minor':
        return 'Used in classical and jazz music. The raised 6th and 7th when ascending help create smoother melodic lines.';
      case 'dorian':
        return 'Popular in jazz, rock, and folk music. Key songs include "Scarborough Fair" and Miles Davis\'s "So What."';
      case 'phrygian':
        return 'Used in Spanish music, flamenco, metal, and film scores for exotic or tense moments.';
      case 'lydian':
        return 'Often used in film scores for dreamy sequences, and in jazz. The theme from "The Simpsons" uses Lydian.';
      case 'mixolydian':
        return 'Common in folk, rock, and blues. Many Grateful Dead songs use Mixolydian. The Beatles\' "Norwegian Wood" is a famous example.';
      case 'locrian':
        return 'Rarely used as the main scale for entire pieces due to its unstable sound, but used for particular effects or sections.';
      case 'pentatonic_major':
        return 'Common in folk, country, and pop music. Easy to use for improvisation and creates a happy, open sound.';
      case 'pentatonic_minor':
        return 'The foundation of blues, rock solos, and many forms of global folk music. Extremely popular for guitar solos.';
      case 'blues':
        return 'Essential in blues, rock, and jazz. The added blue note (♭5) creates the characteristic "bluesy" sound.';
      case 'whole_tone':
        return 'Used for dream sequences, underwater scenes in film music, and jazz improvisation. Claude Debussy used it extensively.';
      case 'chromatic':
        return 'Used for virtuosic runs, transitions between keys, and creating tension. Common in classical, jazz, and film music.';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Choose a Scale</h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Root Note</h4>
                <div className="grid grid-cols-4 gap-2">
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
              
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Scale Type</h4>
                <select
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-black"
                >
                  {scaleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {scaleNotes.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedRoot} {scaleTypes.find(type => type.id === selectedScale)?.name} Scale
              </h3>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {scaleNotes.map((note, index) => (
                    <div key={index} className="relative">
                      <div className="px-6 py-3 bg-amber-100 text-amber-800 rounded-lg font-medium text-center">
                        {note}
                        <div className="text-xs text-amber-600 mt-1">
                          {getScaleDegreeNames(selectedScale)[index]}
                        </div>
                        {getRomanNumerals(selectedScale)[index] && (
                          <div className="text-xs text-amber-500 mt-1">
                            {getRomanNumerals(selectedScale)[index]}
                          </div>
                        )}
                      </div>
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
                      activeNotes={scaleNotes} 
                      startOctave={octave} 
                      endOctave={octave} 
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    onClick={playScale}
                    disabled={isPlaying}
                  >
                    Play Ascending
                  </Button>
                  <Button
                    onClick={playDescendingScale}
                    disabled={isPlaying}
                  >
                    Play Descending
                  </Button>
                </div>
                
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Scale Formula</h4>
                  <p className="text-gray-600">
                    {scaleTypes.find(type => type.id === selectedScale)?.formula.map((interval, i) => {
                      if (i === 0) return 'R';
                      const halfSteps = interval - (scaleTypes.find(type => type.id === selectedScale)?.formula[i-1] || 0);
                      return halfSteps === 1 ? 'H' : 'W';
                    }).join(' - ')}
                    {selectedScale === 'blues' && ' (where H = half step, W = whole step, R = root)'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      <div>
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Scale Information</h3>
          
          {selectedScale && (
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                About the {scaleTypes.find(type => type.id === selectedScale)?.name} Scale
              </h4>
              <p className="text-gray-600 mb-4">
                {getScaleDescription(selectedScale)}
              </p>
              
              <h4 className="text-lg font-medium text-gray-700 mb-2">Common Uses</h4>
              <p className="text-gray-600">
                {getScaleUses(selectedScale)}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-2">Practice Ideas</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Practice this scale ascending and descending to build fluency</li>
                  <li>• Try playing the scale in different octaves</li>
                  <li>• Create melodies using only notes from this scale</li>
                  <li>• Build chords from each note of the scale</li>
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ScaleExplorerTool() {
  return (
    <AudioProvider>
      <PageContainer
        title="Scale Explorer"
        description="Discover and explore different musical scales and their uses."
        showDashboardLink
      >
        <ScaleExplorerContent />
      </PageContainer>
    </AudioProvider>
  );
}