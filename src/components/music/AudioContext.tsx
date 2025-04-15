"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Tone from 'tone';

interface AudioContextType {
  initializeTone: () => Promise<void>;
  createSynth: () => Tone.Synth;
  createPolySynth: () => Tone.PolySynth;
  playNote: (note: string, duration?: string) => void;
  playChord: (notes: string[], duration?: string) => void;
  isAudioInitialized: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [polySynth, setPolySynth] = useState<Tone.PolySynth | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (synth) synth.dispose();
      if (polySynth) polySynth.dispose();
    };
  }, [synth, polySynth]);

  const initializeTone = async () => {
    if (typeof window === 'undefined') return;

    try {
      await Tone.start();
      
      // Only create synths if they don't exist yet
      if (!synth) {
        const newSynth = new Tone.Synth().toDestination();
        setSynth(newSynth);
      }
      
      if (!polySynth) {
        const newPolySynth = new Tone.PolySynth(Tone.Synth).toDestination();
        setPolySynth(newPolySynth);
      }
      
      setIsAudioInitialized(true);
    } catch (error) {
      console.error("Could not initialize Tone.js:", error);
    }
  };

  const createSynth = () => {
    return new Tone.Synth().toDestination();
  };

  const createPolySynth = () => {
    return new Tone.PolySynth(Tone.Synth).toDestination();
  };

  const playNote = (note: string, duration = "8n") => {
    if (!synth) return;
    synth.triggerAttackRelease(note, duration);
  };

  const playChord = (notes: string[], duration = "4n") => {
    if (!polySynth) return;
    polySynth.triggerAttackRelease(notes, duration);
  };

  const value = {
    initializeTone,
    createSynth,
    createPolySynth,
    playNote,
    playChord,
    isAudioInitialized
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}