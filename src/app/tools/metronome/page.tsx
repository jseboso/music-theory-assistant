"use client";

import { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MetronomeTool() {
  const [tempo, setTempo] = useState(100);
  const [timeSignature, setTimeSignature] = useState({ beats: 4, value: 4 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  
  // Common time signatures
  const timeSignatures = [
    { beats: 2, value: 4 },
    { beats: 3, value: 4 },
    { beats: 4, value: 4 },
    { beats: 6, value: 8 },
    { beats: 9, value: 8 },
    { beats: 12, value: 8 },
  ];

  // Initialize audio context when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      // Clean up
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playClick = (isAccented: boolean) => {
    if (!audioContextRef.current) return;
    
    // Create oscillator for the click sound
    const osc = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    // Set the frequency based on whether it's an accented beat
    osc.frequency.value = isAccented ? 1000 : 800;
    
    // Connect the oscillator to gain and output
    osc.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    // Set volume
    gainNode.gain.value = isAccented ? 0.3 : 0.2;
    
    // Play a short click
    osc.start();
    osc.stop(audioContextRef.current.currentTime + 0.05);
  };

  const startMetronome = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    
    setIsPlaying(true);
    setCurrentBeat(0);
    
    // Calculate interval duration based on tempo (BPM)
    const intervalDuration = 60000 / tempo;
    
    // Play first beat immediately
    playClick(true);
    
    let beat = 1;
    
    intervalIdRef.current = setInterval(() => {
      // Play click sound (accented on first beat)
      const isAccented = beat === 0;
      playClick(isAccented);
      
      // Update current beat
      setCurrentBeat(beat);
      
      // Increment beat and wrap around
      beat = (beat + 1) % timeSignature.beats;
    }, intervalDuration);
  };

  const stopMetronome = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    
    setIsPlaying(false);
    setCurrentBeat(0);
  };

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);
    
    // Restart metronome if already playing
    if (isPlaying) {
      stopMetronome();
      // Small delay to ensure clean restart
      setTimeout(() => {
        startMetronome();
      }, 50);
    }
  };

  const handleTimeSignatureChange = (signature: { beats: number, value: number }) => {
    setTimeSignature(signature);
    
    // Restart metronome if already playing
    if (isPlaying) {
      stopMetronome();
      // Small delay to ensure clean restart
      setTimeout(() => {
        startMetronome();
      }, 50);
    }
  };

  return (
    <PageContainer
      title="Metronome"
      description="Keep perfect time with our interactive metronome tool."
      showDashboardLink
    >
      <Card className="max-w-2xl mx-auto p-8">
        {/* Metronome visualization */}
        <div className="flex justify-center mb-8">
          <div className="w-64 h-64 rounded-full border-8 border-amber-700 flex items-center justify-center relative">
            <div className="absolute w-full h-full">
              {Array.from({ length: timeSignature.beats }).map((_, index) => (
                <div 
                  key={index} 
                  className={`absolute w-6 h-6 rounded-full transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                    currentBeat === index 
                      ? 'bg-amber-700 scale-125' 
                      : index === 0 
                        ? 'bg-amber-300' 
                        : 'bg-amber-200'
                  }`}
                  style={{
                    top: '50%',
                    left: '50%',
                    marginLeft: `${Math.cos(2 * Math.PI * index / timeSignature.beats - Math.PI / 2) * 100}px`,
                    marginTop: `${Math.sin(2 * Math.PI * index / timeSignature.beats - Math.PI / 2) * 100}px`,
                  }}
                />
              ))}
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-700 mb-2">{tempo}</div>
              <div className="text-gray-600">BPM</div>
            </div>
          </div>
        </div>
        
        {/* Tempo controls */}
        <div className="mb-8">
          <label htmlFor="tempo-slider" className="block text-lg font-medium text-gray-700 mb-2">
            Tempo: {tempo} BPM
          </label>
          <input
            id="tempo-slider"
            type="range"
            min="40"
            max="220"
            step="1"
            value={tempo}
            onChange={(e) => handleTempoChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>40</span>
            <span>Slow</span>
            <span>Moderate</span>
            <span>Fast</span>
            <span>220</span>
          </div>
        </div>
        
        {/* Time signature selector */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Time Signature: {timeSignature.beats}/{timeSignature.value}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSignatures.map((sig) => (
              <Button
                key={`${sig.beats}/${sig.value}`}
                variant={sig.beats === timeSignature.beats && sig.value === timeSignature.value ? 'primary' : 'outline'}
                onClick={() => handleTimeSignatureChange(sig)}
              >
                {sig.beats}/{sig.value}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Play/stop button */}
        <div className="text-center">
          <Button
            onClick={toggleMetronome}
            size="lg"
            className={`px-8 py-4 rounded-full text-lg shadow-md ${
              isPlaying ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            {isPlaying ? 'Stop' : 'Start'}
          </Button>
        </div>
        
        {/* Additional tips */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Metronome Tips</h3>
          <ul className="text-gray-600 space-y-2">
            <li>• Practice with a metronome regularly to improve your timing and rhythm.</li>
            <li>• Start at a slower tempo and gradually increase as you become more comfortable.</li>
            <li>• Try different time signatures to practice various musical styles.</li>
            <li>• Focus on feeling the pulse rather than just hearing it.</li>
          </ul>
        </div>
      </Card>
    </PageContainer>
  );
}