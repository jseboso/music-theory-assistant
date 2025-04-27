"use client";

import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAudio, AudioProvider } from '@/components/music/AudioContext';
import { 
  intervalOptions, 
  getRandomNote, 
  getIntervalNote 
} from '@/components/music/MusicTheory';

import * as Tone from 'tone';

const exercises = [
  { id: 'intervals', name: 'Interval Recognition', description: 'Identify the interval between two notes.' },
  { id: 'chords', name: 'Chord Recognition', description: 'Identify major, minor, and other chord types.' },
  { id: 'scales', name: 'Scale Recognition', description: 'Identify different types of scales.' },
];

const chordOptions = [
  'Major', 'Minor', 'Diminished', 'Augmented',
  'Major 7th', 'Minor 7th', 'Dominant 7th'
];

const scaleOptions = [
  'Major', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor',
  'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'
];

function EarTrainingContent() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { 
    initializeTone, 
    playNote, 
    playChord, 
    isAudioInitialized,
    createSynth
  } = useAudio();

  useEffect(() => {
    initializeTone();
  }, [initializeTone]);

  const playInterval = () => {
    if (!isAudioInitialized) return;
    
    setIsPlaying(true);
    setUserAnswer(null);
    setIsCorrect(null);
    
    const startNote = getRandomNote();
    const intervalIndex = Math.floor(Math.random() * intervalOptions.length);
    const intervalName = intervalOptions[intervalIndex];
    const endNote = getIntervalNote(startNote, intervalName);
    
    setCorrectAnswer(intervalName);
    
    // Play the interval
    const now = Tone.now();
    const synth = createSynth();
    synth.triggerAttackRelease(startNote, "4n", now);
    synth.triggerAttackRelease(endNote, "4n", now + 1);
    
    setTimeout(() => {
      setIsPlaying(false);
      synth.dispose();
    }, 2000);
  };

  const playChordExercise = () => {
    if (!isAudioInitialized) return;
    
    setIsPlaying(true);
    setUserAnswer(null);
    setIsCorrect(null);
    
    const chordIndex = Math.floor(Math.random() * chordOptions.length);
    const chordName = chordOptions[chordIndex];
    setCorrectAnswer(chordName);
    
    const baseNote = 'C4';
    let chordNotes = [baseNote];
    
    if (chordName === 'Major') {
      chordNotes.push('E4', 'G4');
    } else if (chordName === 'Minor') {
      chordNotes.push('Eb4', 'G4');
    } else if (chordName === 'Diminished') {
      chordNotes.push('Eb4', 'Gb4');
    } else if (chordName === 'Augmented') {
      chordNotes.push('E4', 'G#4');
    } else if (chordName === 'Major 7th') {
      chordNotes.push('E4', 'G4', 'B4');
    } else if (chordName === 'Minor 7th') {
      chordNotes.push('Eb4', 'G4', 'Bb4');
    } else if (chordName === 'Dominant 7th') {
      chordNotes.push('E4', 'G4', 'Bb4');
    }
    
    playChord(chordNotes, "2n");
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const playScaleExercise = () => {
    if (!isAudioInitialized) return;
    
    setIsPlaying(true);
    setUserAnswer(null);
    setIsCorrect(null);
    
    const scaleIndex = Math.floor(Math.random() * scaleOptions.length);
    const scaleName = scaleOptions[scaleIndex];
    setCorrectAnswer(scaleName);
    
    const baseOctave = 4;
    let scaleNotes = [];
    
    if (scaleName === 'Major') {
      scaleNotes = [`C${baseOctave}`, `D${baseOctave}`, `E${baseOctave}`, `F${baseOctave}`, 
                   `G${baseOctave}`, `A${baseOctave}`, `B${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Natural Minor') {
      scaleNotes = [`C${baseOctave}`, `D${baseOctave}`, `Eb${baseOctave}`, `F${baseOctave}`, 
                   `G${baseOctave}`, `Ab${baseOctave}`, `Bb${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Harmonic Minor') {
      scaleNotes = [`C${baseOctave}`, `D${baseOctave}`, `Eb${baseOctave}`, `F${baseOctave}`, 
                   `G${baseOctave}`, `Ab${baseOctave}`, `B${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Melodic Minor') {
      scaleNotes = [`C${baseOctave}`, `D${baseOctave}`, `Eb${baseOctave}`, `F${baseOctave}`, 
                   `G${baseOctave}`, `A${baseOctave}`, `B${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Dorian') {
      scaleNotes = [`C${baseOctave}`, `D${baseOctave}`, `Eb${baseOctave}`, `F${baseOctave}`, 
                   `G${baseOctave}`, `A${baseOctave}`, `Bb${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Phrygian') {
      scaleNotes = [`C${baseOctave}`, `Db${baseOctave}`, `Eb${baseOctave}`, `F${baseOctave}`, 
                   `G${baseOctave}`, `Ab${baseOctave}`, `Bb${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Lydian') {
      scaleNotes = [`C${baseOctave}`, `D${baseOctave}`, `E${baseOctave}`, `F#${baseOctave}`, 
                   `G${baseOctave}`, `A${baseOctave}`, `B${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Mixolydian') {
      scaleNotes = [`C${baseOctave}`, `D${baseOctave}`, `E${baseOctave}`, `F${baseOctave}`, 
                   `G${baseOctave}`, `A${baseOctave}`, `Bb${baseOctave}`, `C${baseOctave + 1}`];
    } else if (scaleName === 'Locrian') {
      scaleNotes = [`C${baseOctave}`, `Db${baseOctave}`, `Eb${baseOctave}`, `F${baseOctave}`, 
                   `Gb${baseOctave}`, `Ab${baseOctave}`, `Bb${baseOctave}`, `C${baseOctave + 1}`];
    }
    
    const now = Tone.now();
    const synth = createSynth();
    scaleNotes.forEach((note, index) => {
      synth.triggerAttackRelease(note, "8n", now + index * 0.25);
    });
    
    setTimeout(() => {
      setIsPlaying(false);
      synth.dispose();
    }, scaleNotes.length * 250 + 500);
  };

  const handlePlay = () => {
    if (selectedExercise === 'intervals') {
      playInterval();
    } else if (selectedExercise === 'chords') {
      playChordExercise();
    } else if (selectedExercise === 'scales') {
      playScaleExercise();
    }
  };

  const handleSubmit = () => {
    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const renderOptions = () => {
    let options;
    
    if (selectedExercise === 'intervals') {
      options = intervalOptions;
    } else if (selectedExercise === 'chords') {
      options = chordOptions;
    } else if (selectedExercise === 'scales') {
      options = scaleOptions;
    } else {
      return null;
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        {options.map((option) => (
          <Button
            key={option}
            variant={userAnswer === option ? 'primary' : 'outline'}
            onClick={() => setUserAnswer(option)}
            disabled={isPlaying}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  if (!selectedExercise) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.id}
            highlightBar
            onClick={() => setSelectedExercise(exercise.id)}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{exercise.name}</h3>
            <p className="text-gray-600 mb-4">{exercise.description}</p>
            <Button fullWidth>
              Start Exercise
            </Button>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          {exercises.find(e => e.id === selectedExercise)?.name}
        </h3>
        <button
          onClick={() => setSelectedExercise(null)}
          className="text-amber-700 hover:text-amber-600"
        >
          Change Exercise
        </button>
      </div>
      
      <div className="text-center mb-8">
        <Button
          onClick={handlePlay}
          disabled={isPlaying}
          size="lg"
          className="px-8 py-4 rounded-full text-lg"
        >
          {isPlaying ? 'Playing...' : 'Play Sound'}
        </Button>
        <p className="text-gray-600 mt-2">
          Listen carefully and select your answer below
        </p>
      </div>
      
      {renderOptions()}
      
      {userAnswer && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleSubmit}
            size="lg"
          >
            Check Answer
          </Button>
        </div>
      )}
      
      {isCorrect !== null && (
        <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect 
              ? 'Correct! Well done!' 
              : `Incorrect. The correct answer was ${correctAnswer}.`}
          </p>
          <button
            onClick={handlePlay}
            className="mt-2 text-amber-700 hover:text-amber-600 font-medium"
          >
            Try another one
          </button>
        </div>
      )}
    </Card>
  );
}

export default function EarTrainingTool() {
  return (
    <AudioProvider>
      <PageContainer
        title="Ear Training"
        description="Train your musical ear by identifying intervals, chords, and scales."
        showDashboardLink
      >
        <EarTrainingContent />
      </PageContainer>
    </AudioProvider>
  );
}